// swift-tools-version:5.3
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "CentralSeaServerAPI",
    platforms: [
       .macOS(.v10_15)
    ],
    products: [
        .library(
            name: "CentralSeaServerAPI",
            targets: ["CentralSeaServerAPI"]
        ),
    ],
    dependencies: [
        .package(url: "https://github.com/AnachronisticTech/WebServiceBuilder", from: "1.0.0"),
        .package(url: "https://github.com/vapor/fluent.git", from: "4.0.0"),
        .package(url: "https://github.com/weichsel/ZIPFoundation.git", .upToNextMajor(from: "0.9.0")),
    ],
    targets: [
        .target(
            name: "CentralSeaServerAPI",
            dependencies: [
                .product(name: "WebServiceBuilder", package: "WebServiceBuilder"),
                .product(name: "Fluent", package: "fluent"),
                .product(name: "ZIPFoundation", package: "ZIPFoundation")
            ],
            exclude: ["Site"],
            resources: [
                .copy("Public")
            ]
        ),
    ]
)
