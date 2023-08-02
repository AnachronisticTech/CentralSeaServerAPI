//
//  CentralSeaServer.swift
//  
//
//  Created by Daniel Marriner on 02/08/2023.
//

import Vapor

struct CentralSeaServer: RouteCollection
{
    let staticPath: String

    func boot(routes: Vapor.RoutesBuilder) throws {
        let group = routes.grouped("CentralSeaServer")
        group.get(use: getHome)
        group.get("market", use: getMarket)
        group.get("maps", use: getMaps)
        group.get("info", use: getInfo)
    }

    func getHome(req: Request) throws -> Response
    {
        req.fileio.streamFile(at: "\(staticPath)/index.html")
    }

    func getMarket(req: Request) throws -> Response
    {
        req.fileio.streamFile(at: "\(staticPath)/market.html")
    }

    func getMaps(req: Request) throws -> Response
    {
        req.fileio.streamFile(at: "\(staticPath)/maps.html")
    }

    func getInfo(req: Request) throws -> Response
    {
        req.fileio.streamFile(at: "\(staticPath)/info.html")
    }
}
