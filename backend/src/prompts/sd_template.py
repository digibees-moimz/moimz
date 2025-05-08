# src/prompts/sd_template.py

"""
Prompt data for Stable Diffusion character generation.
Each category key maps to levels 1 through 5, each providing a list of 2+ prompt keyword variants.
"""

prompt_data: dict[str, dict[int, list[str]]] = {
    # 1. Dining
    "dining": {
        1: [
            "chef apron, ladle, steaming dish",
            "kitchen trainee outfit, frying pan, cutting board",
            "home cook attire, wooden spoon, simmering pot",
        ],
        2: [
            "casual chef coat, wooden spatula, chopping herbs",
            "street-food vendor jacket, tteokbokki pot, neon sign",
            "bistro chef vest, skillet, plating station",
        ],
        3: [
            "fine-dining chef uniform, silver cloche, plated entrée",
            "white chef jacket, plating tweezers, gourmet dish",
            "Michelin-level chef attire, black apron, plated amuse-bouche",
        ],
        4: [
            "celebrity chef whites, golden pan, truffle garnish",
            "star chef suit, flame-torch, artistic plating",
            "award-winning chef outfit, copper pot, delicate garnish",
        ],
        5: [
            "Michelin three-star chef uniform, red collar, golden ladle",
            "legendary chef attire, diamond spatula, haute cuisine",
            "royal chef robes, jeweled insignia, masterpiece dish",
        ],
    },

    # 2. Cafe / Dessert
    "cafe": {
        1: [
            "barista apron, latte cup, heart latte art",
            "pastry chef hat, croissant tray, flour dust",
            "biscotti baker coat, espresso shot, ceramic saucer",
        ],
        2: [
            "barista vest, siphon coffee maker, steaming mug",
            "pâtissier uniform, strawberry shortcake, powdered sugar",
            "coffee shop uniform, french press, wooden counter",
        ],
        3: [
            "hipster barista outfit, chemex, latte leaf art",
            "artisan pastry jacket, macaron tower, sugar dust",
            "cozy cafe sweater, cinnamon roll, wooden table",
        ],
        4: [
            "roaster master coat, burlap coffee sacks, professional grinder",
            "award-winning pastry suit, fondant roses, showpiece cake",
        ],
        5: [
            "world-champion barista uniform, championship trophy, golden tamper",
            "michelin pastry chef robes, crystal dessert stand, edible gold leaf",
            "legendary cafe mogul outfit, bespoke coffee blend, velvet ribbon",
        ],
    },

    # 3. Drinks (Bar/Pub)
    "drinks": {
        1: [
            "bartender vest, beer mug, foam splash",
            "pub apron, wooden beer barrel, oak tap",
            "casual bar coat, bottle opener, coaster",
        ],
        2: [
            "mixologist waistcoat, cocktail shaker, martini glass",
            "speakeasy apron, amber whiskey, leather bar stool",
            "craft beer brewer coat, copper tankard, hops wreath",
        ],
        3: [
            "speakeasy bartender tux, crystal decanter, old fashioned",
            "cocktail expert vest, flaming drink, citrus twist",
            "rum sommelier outfit, aged rum bottle, tasting glass",
        ],
        4: [
            "award-winning mixologist suit, smoke-infused glass, silver jigger",
            "luxury bartender uniform, golden shaker, smoke effect",
        ],
        5: [
            "world-class bartender tuxedo, gold shaker, rare whisky bottle",
            "legendary mixologist cloak, diamond stirrer, platinum coupe",
            "royal bar master robes, aged scotch library, chandelier backdrop",
        ],
    },

    # 4. Sports / Outdoor
    "sports_outdoor": {
        1: [
            "sports jersey, basketball, indoor court",
            "hiking jacket, trekking pole, hillside grass",
            "running singlet, stopwatch, running track",
        ],
        2: [
            "bowling team shirt, bowling pin and ball, glossy lane",
            "swim coach outfit, goggles, pool lane",
            "cycling jersey, road bike, helmet",
        ],
        3: [
            "camping parka, backpack, campfire tent",
            "rock climbing gear, chalk bag, vertical cliff",
            "kayaking vest, paddle, river rapids",
        ],
        4: [
            "mountain climber suit, ice axe, snowy peak",
            "paraglider harness, soaring wing, alpine vista",
        ],
        5: [
            "extreme explorer outfit, summit flag, sunrise background",
            "ultra marathon gear, rugged trail, medal podium",
            "polar expedition suit, icebreaker ship, aurora sky",
        ],
    },

    # 5. Culture (Movie/Show/Exhibition)
    "culture": {
        1: [
            "theater coat, popcorn bucket, cinema screen glow",
            "casual jacket, 3D glasses, movie ticket",
            "performer costume, stage lights, microphone",
        ],
        2: [
            "gallery visitor outfit, brochure, modern art frame",
            "opera casual dress, ear trumpet, velvet seat",
        ],
        3: [
            "classic suit, opera glasses, red velvet curtain",
            "historic reenactment costume, powdered wig, grand stage",
        ],
        4: [
            "fashionable art critic attire, sketch notebook, sculpture hall",
            "avant-garde outfit, performance art prop, spotlight",
        ],
        5: [
            "VIP gala outfit, champagne flute, spotlight background",
            "royal patron robe, classical statue, museum gala hall",
        ],
    },

    # 6. Travel
    "travel": {
        1: [
            "tourist outfit, rolling suitcase, airport gate",
            "casual traveler hoodie, boarding pass, window seat",
            "backpack explorer clothes, trail map, hiking boots",
        ],
        2: [
            "street explorer jacket, DSLR camera, cobblestone alley",
            "backpacker jacket, giant backpack, trail map",
        ],
        3: [
            "island vacation shirt, straw hat, tropical drink",
            "safari vest, binoculars, savannah background",
        ],
        4: [
            "desert explorer robe, jeep, sandy dunes",
            "ski instructor suit, snow goggles, alpine lodge",
        ],
        5: [
            "first-class traveler suit, luxury luggage, private jet stairs",
            "mountain chalet fur coat, panoramic snowy peak",
        ],
    },

    # 7. Shopping / Convenience
    "shopping": {
        1: [
            "casual hoodie, shopping bag, convenience-store shelf",
            "simple tee, grocery basket, snack aisle",
            "jeans and tee, coin purse, cashier counter",
        ],
        2: [
            "fashion shopper dress, boutique bag, mannequins",
            "business attire, shopping mall escalator, brand logo",
        ],
        3: [
            "weekend market outfit, canvas tote, fresh produce",
            "artisan market apron, handcrafted goods",
        ],
        4: [
            "trendsetter blazer, designer paper bags, flagship store",
            "tech shopper jacket, electronics box, showroom",
        ],
        5: [
            "luxury shopper gown, multiple branded bags, red-carpet mall",
            "VIP concierge suit, exclusive lounge, gold card invitation",
            "holiday shopper outfit, gift boxes, snowy window display",
        ],
    },
}
