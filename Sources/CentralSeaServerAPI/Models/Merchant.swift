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
        var dataJson: String = data
            .replacingOccurrences(of: Substitutions.In.summon, with: Substitutions.Out.summon)
            .replacingOccurrences(of: Substitutions.In.regex, with: Substitutions.Out.regex, options: .regularExpression)
            .replacingOccurrences(of: Substitutions.In.backslashes1, with: Substitutions.Out.backslash)
        dataJson = dataJson
            .replacingOccurrences(of: Substitutions.In.backslashes2, with: Substitutions.Out.backslash)
            .replacingOccurrences(of: Substitutions.In.backslashes3, with: Substitutions.Out.backslash)
            .replacingOccurrences(of: Substitutions.In.openBrace, with: Substitutions.Out.openBrace)
            .replacingOccurrences(of: Substitutions.In.closeBrace, with: Substitutions.Out.closeBrace)
        dataJson = dataJson
            .replacingOccurrences(of: Substitutions.In.name1, with: Substitutions.Out.name)
            .replacingOccurrences(of: Substitutions.In.name2, with: Substitutions.Out.name)
            .replacingOccurrences(of: Substitutions.In.offers, with: Substitutions.Out.offers)
            .replacingOccurrences(of: Substitutions.In.recipes, with: Substitutions.Out.recipes)
        dataJson = dataJson
            .replacingOccurrences(of: Substitutions.In.count, with: Substitutions.Out.count)
            .replacingOccurrences(of: Substitutions.In.enchantments, with: Substitutions.Out.enchantments)
            .replacingOccurrences(of: Substitutions.In.enchantment, with: Substitutions.Out.enchantment)
            .replacingOccurrences(of: Substitutions.In.level, with: Substitutions.Out.level)
        dataJson = dataJson
            .replacingOccurrences(of: Substitutions.In.potion, with: Substitutions.Out.potion)
            .replacingOccurrences(of: Substitutions.In.customModelData, with: Substitutions.Out.customModelData)
            .replacingOccurrences(of: Substitutions.In.false, with: Substitutions.Out.false)
            .replacingOccurrences(of: Substitutions.In.true, with: Substitutions.Out.true)

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

    private enum Substitutions
    {
        public enum In
        {
            static let summon = "summon villager ~ ~ ~ "
            static let regex = "([A-Za-z]+):([0-9]|\"|false|true|\\[|\\{)"
            static let backslashes1 = "\"\\\""
            static let backslashes2 = "\\\"\""
            static let backslashes3 = "\\\""
            static let openBrace = "\"{"
            static let closeBrace = "}\""
            static let name1 = "CustomName"
            static let name2 = "Name"
            static let offers = "Offers"
            static let recipes = "Recipes"
            static let count = "Count"
            static let enchantments = "StoredEnchantments"
            static let enchantment = "Enchantment"
            static let level = "lvl"
            static let potion = "Potion"
            static let customModelData = "CustomModelData"
            static let `false` = "\"false\""
            static let `true` = "\"true\""
        }

        public enum Out
        {
            static let summon = ""
            static let regex = "\"$1\":$2"
            static let backslash = "\""
            static let openBrace = "{"
            static let closeBrace = "}"
            static let name = "name"
            static let offers = "offers"
            static let recipes = "recipes"
            static let count = "count"
            static let enchantments = "enchantments"
            static let enchantment = "enchantment"
            static let level = "level"
            static let potion = "potion"
            static let customModelData = "customModelData"
            static let `false` = "false"
            static let `true` = "true"
        }
    }
}
