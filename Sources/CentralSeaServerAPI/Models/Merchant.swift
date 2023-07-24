//
//  Merchant.swift
//  
//
//  Created by Daniel Marriner on 16/10/2022.
//

import Vapor
import Fluent

final class Merchant: Model, Content {
    static var schema: String = "merchants"

    @ID(key: .id)
    var id: UUID?

    @Field(key: "name")
    var name: String

    @Field(key: "data")
    var data: String

    @Field(key: "isLimitedTime")
    var isLimitedTime: Bool

    init() {}

    init(
        id: UUID? = nil,
        data: String,
        isLimitedTime: Bool = false
    ) throws {
        self.id = id
        self.data = data
        self.name = try Merchant.parse(data: data).name
        self.isLimitedTime = isLimitedTime
    }

    func toOutput() throws -> Output {
        let villager = try Merchant.parse(data: data)
        return Output(id: id!, name: name, isLimitedTime: isLimitedTime, trades: villager.offers.recipes)
    }

    private static func parse(data: String) throws -> Villager {
        let dataJson = data
            .replacingOccurrences(of: "summon villager ~ ~ ~ ", with: "")
            .replacingOccurrences(of: "([A-Za-z]+):([0-9]|\"|false|true|\\[|\\{)", with: "\"$1\":$2", options: .regularExpression)
            .replacingOccurrences(of: "\"\\\"", with: "\"")
            .replacingOccurrences(of: "\\\"\"", with: "\"")
            .replacingOccurrences(of: "\\\"", with: "\"")
            .replacingOccurrences(of: "\"{", with: "{")
            .replacingOccurrences(of: "}\"", with: "}")
            .replacingOccurrences(of: "CustomName", with: "name")
            .replacingOccurrences(of: "Name", with: "name")
            .replacingOccurrences(of: "Offers", with: "offers")
            .replacingOccurrences(of: "Recipes", with: "recipes")
            .replacingOccurrences(of: "Count", with: "count")
            .replacingOccurrences(of: "StoredEnchantments", with: "enchantments")
            .replacingOccurrences(of: "Enchantment", with: "enchantment")
            .replacingOccurrences(of: "lvl", with: "level")
            .replacingOccurrences(of: "Potion", with: "potion")
            .replacingOccurrences(of: "CustomModelData", with: "customModelData")
            .replacingOccurrences(of: "\"false\"", with: "false")
            .replacingOccurrences(of: "\"true\"", with: "true")

//        guard let villagerData = try? JSONEncoder().encode(dataJson) else {
//            throw Abort(.custom(code: 5, reasonPhrase: "Could not serialize villager data"))
//        }

        guard let decodedVillager = try? JSONDecoder().decode(Villager.self, from: Data(dataJson.utf8)) else {
            throw Abort(.custom(code: 6, reasonPhrase: "Could not deserialize villager data \(dataJson)"))
        }

        return decodedVillager
    }

    private struct Villager: Decodable {
        let name: String
        let offers: VillagerOffers

        struct VillagerOffers: Decodable {
            let recipes: [Trade]
        }
    }

    struct Output: Content {
        let id: UUID
        let name: String
        let isLimitedTime: Bool
        let trades: [Trade]
    }

    struct Trade: Codable {
        let buy: Item
        let buyB: Item?
        let sell: Item

        struct Item: Codable {
            let id: String
            let count: Int
            let tag: Tag?
            let name: String?

            struct Tag: Codable {
                let display: Display?
                let customModelData: Int?
                let potion: String?
                let enchantments: [Enchantment]?

                struct Display: Codable {
                    let name: TagName
                }

                struct Enchantment: Codable {
                    let id: String
                    let level: Int
                }
            }

            struct TagName: Codable {
                let italic: Bool?
                let color: String?
                let text: String?
            }
        }
    }
}
