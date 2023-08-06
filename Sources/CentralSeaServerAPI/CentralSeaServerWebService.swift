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

    internal static let corsMiddleware = CORSMiddleware(configuration: CORSMiddleware.Configuration(
        allowedOrigin: .all,
        allowedMethods: [.GET, .POST, .DELETE],
        allowedHeaders: [.accept, .authorization, .contentType, .origin, .xRequestedWith, .userAgent, .accessControlAllowOrigin]
    ))

    public init(
        publicPath: String,
        pathComponent: String,
        logBehaviour: LogBehaviour = .none,
        devMode: Bool = false
    )
    {
        publicDirectoryPath = publicPath
        publicDirectoryPathComponent = pathComponent
        self.logBehaviour = logBehaviour
        routeCollections = [
            CentralSeaServer(staticPath: "\(publicPath)\(pathComponent)/static"),
            CentralSeaServerShoppingAPI(contentPath: "\(publicPath)\(pathComponent)/content", devMode: devMode),
            CentralSeaServerNewsAPI(providerId: "csnn", devMode: devMode)
        ]
    }

    internal static func validate(secret payloadSecret: String) throws
    {
        guard let secret = Environment.get("UPLOAD_SECRET"), try Bcrypt.verify(payloadSecret, created: secret) else
        {
            throw Abort(.unauthorized)
        }
    }
}
