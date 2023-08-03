const enum Mode
{
    Local = "http://192.168.0.60:8080",
    Dev = "https://dev.anachronistic-tech.co.uk",
    Live = "https://anachronistic-tech.co.uk",
    Hosted = ""
}

export enum Endpoint
{
    Home = "",
    Maps = "maps",
    Market = "market",
    Info = "info"
}

export class API
{
    private static mode: Mode = Mode.Hosted;

    static get baseURL(): string
    {
        return `${this.mode}`;
    }

    public static URLFor(endpoint: Endpoint): string
    {
        if (this.mode != Mode.Hosted && `${endpoint}` != "")
        {
            return `/${endpoint}.html`;
        }

        return `/CentralSeaServer/${endpoint}`
    }
}
