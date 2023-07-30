//
//  CreateMerchant.swift
//  
//
//  Created by Daniel Marriner on 16/10/2022.
//

import Vapor
import FluentKit
import FluentSQL
import MySQLNIO

struct CreateMerchant: Migration
{
    func prepare(on database: Database) -> EventLoopFuture<Void>
    {
        let builder = database
            .schema(Merchant.schema)
            .ignoreExisting()
            .id()
            .field("name", .string, .required)

        if database is MySQLDatabase
        {
            builder
                .field("data", .sql(raw: "TEXT"), .required)
        }
        else
        {
            builder
                .field("data", .string, .required)
        }

        return builder
            .field("isLimitedTime", .bool, .required)
            .create()
    }

    func revert(on database: Database) -> EventLoopFuture<Void>
    {
        return database
            .schema(Merchant.schema)
            .delete()
    }
}
