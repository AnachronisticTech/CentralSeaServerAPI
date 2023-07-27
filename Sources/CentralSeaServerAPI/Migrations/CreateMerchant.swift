//
//  CreateMerchant.swift
//  
//
//  Created by Daniel Marriner on 16/10/2022.
//

import Vapor
import FluentKit

struct CreateMerchant: Migration {
    func prepare(on database: Database) -> EventLoopFuture<Void> {
        return database
            .schema(Merchant.schema)
            .ignoreExisting()
            .id()
            .field("name", .string, .required)
            .field("data", .string, .required)
            .field("isLimitedTime", .bool, .required)
            .create()
    }

    func revert(on database: Database) -> EventLoopFuture<Void> {
        return database
            .schema(Merchant.schema)
            .delete()
    }
}
