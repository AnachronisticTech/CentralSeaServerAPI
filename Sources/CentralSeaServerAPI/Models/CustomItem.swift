//
//  CustomItem.swift
//  
//
//  Created by Daniel Marriner on 15/01/2023.
//

import Vapor
import Fluent

final class CustomItem: Model, Content {
    static var schema: String = "customItems"

    @ID(key: .id)
    var id: UUID?

    @Field(key: "itemId")
    var itemId: String

    @Field(key: "customModelData")
    var customModelData: Int

    @Field(key: "path")
    var path: String

    init() {}

    init(
        id: UUID? = nil,
        itemId: String,
        customModelData: Int,
        path: String
    ) {
        self.id = id
        self.itemId = itemId
        self.customModelData = customModelData
        self.path = path
    }

    struct Input: Decodable {
        let overrides: [ModelData]?

        struct ModelData: Decodable {
            let model: String
            let predicate: Predicate

            struct Predicate: Decodable {
                let customModelData: Int?
                let broken: Int?

                init(from decoder: Decoder) throws {
                    let container: KeyedDecodingContainer<CodingKeys> = try decoder.container(keyedBy: CodingKeys.self)
                    self.customModelData = try container.decodeIfPresent(Int.self, forKey: CodingKeys.customModelData)
                    self.broken = try container.decodeIfPresent(Int.self, forKey: CodingKeys.broken)
                }

                enum CodingKeys: String, CodingKey {
                    case customModelData = "custom_model_data"
                    case broken
                }
            }
        }
    }
}
