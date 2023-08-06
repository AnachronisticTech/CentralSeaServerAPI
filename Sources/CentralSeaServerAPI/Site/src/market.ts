import "./styles.less";
import { Masonry } from "@fristys/masonry"; // Docs: https://fristys.github.io/masonry/
import { v4 as UUID } from "uuid";
import { API } from "./API";

class Merchant
{
    id: string;
    isLimitedTime: boolean;
    name: string;
    trades: Trade[];
    uuid: string;

    constructor(id: string, isLimitedTime: boolean, name: string, trades: Trade[], uuid: string = UUID())
    {
        this.uuid = uuid;
        this.id = id;
        this.isLimitedTime = isLimitedTime;
        this.name = name;
        this.trades = trades.map(trade => Trade.init(trade));
    }

    static init(merchant: Merchant): Merchant
    {
        return new Merchant(
            merchant.id,
            merchant.isLimitedTime,
            merchant.name,
            merchant.trades,
            merchant.uuid
        );
    }
}

class Trade
{
    buy: Item;
    buyB: Item | null;
    sell: Item;
    uuid: string;

    constructor(buy: Item, buyB: Item | null, sell: Item, uuid: string = UUID())
    {
        this.uuid = uuid;
        this.buy = new Item(buy.id, buy.count, buy.tag);
        this.sell = new Item(sell.id, sell.count, sell.tag);
        if (buyB != null)
        {
            this.buyB = new Item(buyB.id, buyB.count, buyB.tag);
        }
        else
        {
            this.buyB = null;
        }
    }

    static init(trade: Trade): Trade
    {
        return new Trade(
            trade.buy,
            trade.buyB,
            trade.sell,
            trade.uuid
        );
    }
}

class Item
{
    id: string;
    count: number;
    tag: Tag | null;

    constructor(id: string, count: number = 1, tag: Tag | null = null)
    {
        this.id = id;
        this.count = count;
        this.tag = tag;
    }

    get name(): string
    {
        return this.tag?.display?.name.text
            ?? this.tag?.potion?.replace("minecraft:", "").replaceAll("_", " ").replace(/^/, "Potion of ")
            ?? this.id.replace("minecraft:", "").replaceAll("_", " ");
    }

    get nameColor(): string | null
    {
        return this.tag?.display?.name.color?.replace("_", "-") ?? null;
    }

    get enchantments(): Enchantment[]
    {
        return this.tag?.enchantments ?? [];
    }

    get customModelData(): number | null
    {
        if (this.tag !== undefined && this.tag !== null && this.tag.customModelData !== undefined && this.tag.customModelData !== null)
        {
            return this.tag.customModelData;
        }

        return null;
    }
}

type Tag =
{
    display: Display | null;
    customModelData: number | null;
    potion: string | null
    enchantments: Enchantment[] | null
}

type Display =
{
    name: TagName;
}

type TagName =
{
    italic: boolean | null;
    color: string | null;
    text: string | null;
}

type Enchantment =
{
    id: string;
    level: number;
}

type CustomItemData =
{
    overrides: CustomItemDataOverrides[];
}
type CustomItemDataOverrides =
{
    predicate: CustomItemDataPredicate;
    model: string;
}
type CustomItemDataPredicate =
{
    custom_model_data: number;
}

type APIResult =
{
    namespacedId: string;
    image: string;
}

let imageMap: Map<string, string> = new Map<string, string>();
let merchantData: Merchant[] = [];
let merchantViews: Map<string, HTMLDivElement> = new Map<string, HTMLDivElement>();
let tradeRows: Map<string, HTMLDivElement> = new Map<string, HTMLDivElement>();

const container: HTMLDivElement = document.getElementById("trade-container") as HTMLDivElement;
const masonry = new Masonry(container,
{
    columns: 4,
    columnBreakpoints:
    {
        1835: 3,
        1545: 2,
        655: 1
    }
});

const searchTextInput: HTMLInputElement = document.getElementById("search") as HTMLInputElement;
searchTextInput.addEventListener("input", render)

const invisibleContainer: HTMLDivElement = document.getElementById("invisible-container") as HTMLDivElement;
const clearSearchButton: HTMLButtonElement = document.getElementById("clear-search") as HTMLButtonElement;
clearSearchButton.addEventListener("click", _ =>
{
    searchTextInput.value = "";
    render();
});

load();

function createMerchantView(merchant: Merchant): HTMLDivElement
{
    const view = document.createElement("div");
    view.id = merchant.uuid;

    const title = document.createElement("h1");
    title.innerHTML = merchant.name;
    view.appendChild(title);

    for (const trade of merchant.trades)
    {
        tradeRows.set(trade.uuid, view.appendChild(createTradeRowView(trade)));
    }

    return view;
}

function createTradeRowView(trade: Trade): HTMLDivElement
{
    const row = document.createElement("div");
    row.id = trade.uuid;
    row.classList.add("minecraft-row");

    row.appendChild(createTradeRowItemView(trade.buy));

    if (trade.buyB != null)
    {
        row.appendChild(createTradeRowItemView(trade.buyB));
    }

    const tradeArrow = document.createElement("img");
    tradeArrow.className = "trade-arrow";
    row.appendChild(tradeArrow);

    row.appendChild(createTradeRowItemView(trade.sell));

    return row;
}

function createTradeRowItemView(item: Item): HTMLDivElement
{
    const itemView = document.createElement("div");
    itemView.classList.add("trade-item");

    if (item.customModelData != null)
    {
        // const imageFallbackView = document.createElement("object");
        // imageFallbackView.data = "https://minecraft-api.vercel.app/images/items/barrier.png";
        // imageFallbackView.type = "image/png";

        const imageView = document.createElement("img");
        imageView.src = `${API.baseURL}/css-api/shopping/customItems/${item.id.replace("minecraft:", "")}/${item.customModelData}`;

        itemView.appendChild(imageView);
    }
    else
    {
        const imageView = document.createElement("img");
        const id = item.id.replace("minecraft:", "");
        const imageUrl = imageMap.get(id);
        if (id == "potion")
        {
            imageView.src = "https://minecraft-api.vercel.app/images/items/potion_of_fire_resistance.gif";
        }
        else if (imageUrl !== undefined && imageUrl !== null)
        {
            imageView.src = imageUrl;
        }
        else
        {
            imageView.src = "https://minecraft-api.vercel.app/images/items/barrier.png";
        }

        itemView.appendChild(imageView);
    }

    if (item.count > 1)
    {
        const itemQuantityView = document.createElement("p");
        itemQuantityView.innerText = item.count.toString();
        itemView.appendChild(itemQuantityView);
    }

    itemView.appendChild(createTooltipView(item))

    return itemView;
}

function createTooltipView(item: Item): HTMLDivElement
{
    const tooltipContainerView = document.createElement("div");
    tooltipContainerView.classList.add("tooltip");
    const tooltipView = document.createElement("div");
    tooltipContainerView.appendChild(tooltipView);

    const titleLabel = document.createElement("p");
    titleLabel.innerText = item.name;
    if (item.nameColor != null)
    {
        titleLabel.classList.add(`chat-${item.nameColor}`);
    }

    tooltipView.appendChild(titleLabel);

    for (const enchantment of item.enchantments)
    {
        if (enchantment.level == 0) { continue; }
        const enchantmentLabel = document.createElement("p");
        enchantmentLabel.classList.add("tooltip-enchantment")
        enchantmentLabel.innerText = `${enchantment.id.replace("minecraft:", "").replaceAll("_", " ")} ${romanize(enchantment.level)}`;
        tooltipView.appendChild(enchantmentLabel);
    }

    const itemIdView = document.createElement("p");
    itemIdView.classList.add("tooltip-item-id");
    itemIdView.innerText = item.id;
    tooltipView.appendChild(itemIdView);

    return tooltipContainerView;
}

function load()
{
    const request = new XMLHttpRequest();
    request.open("GET", "https://minecraft-api.vercel.app/api/items", true)
    request.onload = function()
    {
        for (const data of JSON.parse(this.responseText) as APIResult[])
        {
            imageMap.set(data.namespacedId, data.image);
        }

        loadData();
    }

    request.send();
}

function loadData()
{
    const request = new XMLHttpRequest();
    request.open("GET", `${API.baseURL}/css-api/shopping`, true)
    request.onload = function()
    {
        merchantData = [];
        container.innerHTML = "";
        for (const unsafeMerchant of JSON.parse(this.responseText) as Merchant[])
        {
            if (unsafeMerchant.name == "Black Market") { continue; }
            const merchant = Merchant.init(unsafeMerchant);
            merchantData.push(merchant);
            merchantViews.set(merchant.uuid, container.appendChild(createMerchantView(merchant)));
        }

        render();
    }

    request.send();
}

function render()
{
    tradeRows.forEach((element, _key, _map) => element.classList.add("hidden"));
    merchantViews.forEach((element, _key, _map) =>
    {
        invisibleContainer.appendChild(element);
        element.classList.add("hidden");
    });

    for (const merchant of projectedMerchantData(searchTextInput.value))
    {
        const merchantView = merchantViews.get(merchant.uuid);
        if (merchantView !== undefined && merchantView !== null)
        {
            merchantView.classList.remove("hidden");
            container.appendChild(merchantView);
            for (const trade of merchant.trades)
            {
                tradeRows.get(trade.uuid)?.classList.remove("hidden");
            }
        }
    }

    masonry.init();
}

function projectedMerchantData(term: string): Merchant[]
{
    if (term == "") { return merchantData; }

    term = term.toLowerCase();
    return merchantData
        .map(Merchant.init)
        .filter(merchant =>
        {
            let projectedMerchant = merchant;
            if (projectedMerchant.name.toLowerCase().includes(term)) { return projectedMerchant; }

            projectedMerchant.trades = projectedMerchant.trades.filter(trade =>
                trade.buy.name.toLowerCase().includes(term)
                || trade.buyB?.name.toLowerCase().includes(term)
                || trade.sell.name.toLowerCase().includes(term)
                || trade.buy.id.includes(term)
                || trade.buyB?.id.includes(term)
                || trade.sell.id.includes(term)
                || trade.buy.enchantments.some(enchantment => enchantment.id.includes(term))
                || trade.buyB?.enchantments.some(enchantment => enchantment.id.includes(term))
                || trade.sell.enchantments.some(enchantment => enchantment.id.includes(term))
            );

            return projectedMerchant.trades.length > 0 ? projectedMerchant : null;
        });
}

function parseCommand(text: string)
{
    text = text.replace("summon villager ~ ~ ~ ", "");
    text = text.replace(/([A-Za-z]+):([0-9]|"|false|true|\[|\{)/g, '"$1":$2');
    const data = JSON.parse(text);

    container.innerHTML = "";
    for (const trade of data.Offers.Recipes as Trade[])
    {
        container.appendChild(createTradeRowView(trade));
    }
}

// Attribution: https://blog.stevenlevithan.com/archives/javascript-roman-numeral-converter
function romanize(num: number): string
{
    if (isNaN(num)) { return "NaN"; }

    let digits = String(+num).split("");
    const key = [
        "","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
        "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
        "","I","II","III","IV","V","VI","VII","VIII","IX"
    ];
    let roman = "";
    let i = 3;
    while (i--)
    {
        roman = (key[Number(digits.pop()) + (i * 10)] || "") + roman;
    }

    return Array(+digits.join("") + 1).join("M") + roman;
}
