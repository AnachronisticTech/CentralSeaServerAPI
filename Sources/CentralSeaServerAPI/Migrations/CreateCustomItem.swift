//
//  CreateCustomItem.swift
//  
//
//  Created by Daniel Marriner on 15/01/2023.
//

import Vapor
import Fluent

struct CreateCustomItem: Migration {
    func prepare(on database: Database) -> EventLoopFuture<Void> {
        return database
            .schema(CustomItem.schema)
            .ignoreExisting()
            .id()
            .field("itemId", .string, .required)
            .field("customModelData", .int, .required)
            .field("path", .string, .required)
            .create()
    }

    func revert(on database: Database) -> EventLoopFuture<Void> {
        return database
            .schema(CustomItem.schema)
            .delete()
    }
}
