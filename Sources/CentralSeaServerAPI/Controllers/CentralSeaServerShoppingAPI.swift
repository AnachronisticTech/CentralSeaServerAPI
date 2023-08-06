//
//  CentralSeaServerAPI.swift
//
//
//  Created by Daniel Marriner on 08/10/2022.
//

import Vapor
import Fluent
import ZIPFoundation

struct CentralSeaServerShoppingAPI: RouteCollection
{
    let contentPath: String
    let devMode: Bool

    func boot(routes: RoutesBuilder) throws
    {
        let api = routes.grouped("css-api")

        let shopping = api.grouped("shopping")

        if devMode
        {
            shopping.group(CentralSeaServerService.corsMiddleware) { cors in
                cors.get(use: getAllMerchants)
            }
        }
        else
        {
            shopping.get(use: getAllMerchants)
        }

        shopping.post("datapack", use: updateDatapack)
        shopping.post("resources", use: updateResources)
        shopping.get("customItems", use: getAllCustomItemData)
        shopping.get("customItems", ":id", ":data", use: getCustomItemImagePath)
    }

    // MARK: - Handlers relating to merchants
    func getAllMerchants(req: Request) throws -> EventLoopFuture<[Merchant.Output]>
    {
        Merchant
            .query(on: req.db)
            .sort(\.$name)
            .all()
            .tryFlatMap { merchants in
                req.eventLoop.makeSucceededFuture(
                    try merchants.map { try $0.toOutput() }
                )
            }
    }

    // MARK: - Handlers relating to content
    func updateDatapack(req: Request) throws -> EventLoopFuture<HTTPStatus>
    {
        defer
        {
            try? FileManager.default.removeItem(atPath: "\(contentPath)/datapack.zip")
            try? FileManager.default.removeItem(atPath: "\(contentPath)/datapack")
        }

        let payload = try req.content.decode(SecurePayload<Data>.self)
        try CentralSeaServerService.validate(secret: payload.secret)

        guard FileManager.default.createFile(
            atPath: "\(contentPath)/datapack.zip",
            contents: payload.content
        ) else
        {
            throw Abort(.custom(code: 1, reasonPhrase: "Could not upload file"))
        }

        do
        {
            try FileManager.default.unzipItem(
                at: URL(fileURLWithPath: "\(contentPath)/datapack.zip"),
                to: URL(fileURLWithPath: "\(contentPath)/datapack")
            )
        }
        catch
        {
            throw Abort(.custom(code: 2, reasonPhrase: "Could not extract archive"))
        }

        guard let paths = try? FileManager.default.contentsOfDirectory(atPath: "\(contentPath)/datapack/data/css/functions/css_villagers") else
        {
            throw Abort(.custom(code: 3, reasonPhrase: "Could not traverse datapack hierarchy"))
        }

        let _ = Merchant
            .query(on: req.db)
            .all()
            .flatMap { $0.delete(on: req.db) }

        return try paths
            .map { path in
                req.logger.info("\(path)")
                guard let fileContent = try? String(contentsOfFile: "\(contentPath)/datapack/data/css/functions/css_villagers/\(path)") else
                {
                    throw Abort(.custom(code: 4, reasonPhrase: "Could not read contents of file \(path)"))
                }

                return try Merchant(data: fileContent)
                    .create(on: req.db)
            }
            .flatten(on: req.eventLoop)
            .transform(to: .ok)
    }

    func updateResources(req: Request) throws -> EventLoopFuture<HTTPStatus> {
        defer
        {
            try? FileManager.default.removeItem(atPath: "\(contentPath)/resources.zip")
            try? FileManager.default.removeItem(atPath: "\(contentPath)/resources")
        }

        let payload = try req.content.decode(SecurePayload<Data>.self)
        try CentralSeaServerService.validate(secret: payload.secret)

        guard FileManager.default.createFile(
            atPath: "\(contentPath)/resources.zip",
            contents: payload.content
        ) else
        {
            throw Abort(.custom(code: 1, reasonPhrase: "Could not upload file"))
        }

        do
        {
            try FileManager.default.unzipItem(
                at: URL(fileURLWithPath: "\(contentPath)/resources.zip"),
                to: URL(fileURLWithPath: "\(contentPath)/resources")
            )
        }
        catch
        {
            throw Abort(.custom(code: 2, reasonPhrase: "Could not extract archive"))
        }

        do
        {
            if FileManager.default.fileExists(atPath: "\(contentPath)/minecraft")
            {
                try FileManager.default.removeItem(atPath: "\(contentPath)/minecraft")
            }

            try FileManager.default.moveItem(
                at: URL(fileURLWithPath: "\(contentPath)/resources/assets/minecraft"),
                to: URL(fileURLWithPath: "\(contentPath)/minecraft")
            )
        }
        catch
        {
            throw Abort(.custom(code: 3, reasonPhrase: "Could not move directory"))
        }

        guard let paths = try? FileManager.default.contentsOfDirectory(atPath: "\(contentPath)/minecraft/models/item") else
        {
            throw Abort(.custom(code: 4, reasonPhrase: "Could not traverse resourcepack hierarchy"))
        }

        let _ = CustomItem
            .query(on: req.db)
            .all()
            .flatMap { $0.delete(on: req.db) }

        let decoder = JSONDecoder()

        for path in paths
        {
            req.logger.info("\(path)")
            guard
                let input = try? decoder.decode(CustomItem.Input.self, from: Data(contentsOf: URL(fileURLWithPath: "\(contentPath)/minecraft/models/item/\(path)"), options: [])),
                let overrides = input.overrides else { continue }

            for item in overrides
            {
                if item.predicate.broken != nil { continue }
                guard let modelData = item.predicate.customModelData else { continue }
                let _ = CustomItem(
                    itemId: String(path.split(separator: ".")[0]),
                    customModelData: modelData,
                    path: item.model
                )
                .create(on: req.db)
            }
        }

        return req.eventLoop.future(.ok)
    }

    func getAllCustomItemData(req: Request) throws -> EventLoopFuture<[CustomItem]>
    {
        CustomItem
            .query(on: req.db)
            .all()
    }

    func getCustomItemImagePath(req: Request) throws -> EventLoopFuture<Response>
    {
        CustomItem
            .query(on: req.db)
            .filter(\.$itemId == req.parameters.get("id", as: String.self)!)
            .filter(\.$customModelData == req.parameters.get("data", as: Int.self)!)
            .first()
            .unwrap(or: Abort(.noContent))
            .tryFlatMap { item in
                let path = "\(contentPath)/minecraft/textures/\(item.path).png"
                if FileManager.default.fileExists(atPath: path)
                {
                    return req.eventLoop.makeSucceededFuture(req.fileio.streamFile(at: path))
                }

                throw Abort(.badRequest)
            }
    }
}
