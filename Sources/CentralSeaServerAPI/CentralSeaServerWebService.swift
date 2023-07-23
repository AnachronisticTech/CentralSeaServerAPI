import Foundation
import Fluent
import Vapor
import WebServiceBuilder

public struct CentralSeaServerService : API, FileServer, MigrationsProvider
{
    public var bundle: Bundle { Bundle.module }
    public let logBehaviour: LogBehaviour

    public var publicDirectoryPath: String
    public var publicDirectoryPathComponent: String

    public var routeCollections: [RouteCollection]

    public var migrations: [Migration] = [
        CreateNewsItem(),
        CreateMerchant(),
        CreateCustomItem()
    ]

    public init(
        publicPath: String,
        pathComponent: String,
        logBehaviour: LogBehaviour = .none
    )
    {
        publicDirectoryPath = publicPath
        publicDirectoryPathComponent = pathComponent
        self.logBehaviour = logBehaviour
        routeCollections = [
            CentralSeaServerAPI(contentPath: "\(publicPath)\(pathComponent)/content"),
            CentralSeaServerNewsAPI(providerId: "csnn")
        ]
    }
}
