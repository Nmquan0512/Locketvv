var request = $request;

const options = {
    url: "https://api.revenuecat.com/v1/product_entitlement_mapping",
    headers: {
        'Authorization': request.headers["authorization"],
        'X-Platform': 'iOS',
        'User-Agent': request.headers["user-agent"]
    }
}

$httpClient.get(options, function (error, newResponse, data) {

    const ent = JSON.parse(data);

    // Tạo thời gian hiện tại
    const currentDate = new Date();
    const currentISODate = currentDate.toISOString().split('T')[0]; // Lấy ngày hiện tại dạng YYYY-MM-DD
    const staticTime = "T01:01:01Z"; // Phần giờ không thay đổi

    let jsonToUpdate = {
        "request_date_ms": 1704070861000,
        "request_date": `${currentISODate}${staticTime}`, // Sử dụng thời gian hiện tại
        "subscriber": {
            "entitlement": {},
            "first_seen": `${currentISODate}${staticTime}`,
            "original_application_version": "9692",
            "last_seen": `${currentISODate}${staticTime}`,
            "other_purchases": {},
            "management_url": null,
            "subscriptions": {},
            "entitlements": {},
            "original_purchase_date": `${currentISODate}${staticTime}`,
            "original_app_user_id": "70B24288-83C4-4035-B001-573285B21AE2",
            "non_subscriptions": {}
        }
    };

    const productEntitlementMapping = ent.product_entitlement_mapping;

    for (const [entitlementId, productInfo] of Object.entries(productEntitlementMapping)) {
        const productIdentifier = productInfo.product_identifier;
        const entitlements = productInfo.entitlements;

        for (const entitlement of entitlements) {
            jsonToUpdate.subscriber.entitlements[entitlement] = {
                "purchase_date": `${currentISODate}${staticTime}`,
                "original_purchase_date": `${currentISODate}${staticTime}`,
                "expires_date": "9692-01-01T01:01:01Z",
                "is_sandbox": false,
                "ownership_type": "PURCHASED",
                "store": "app_store",
                "product_identifier": productIdentifier
            };

            // Add product identifier to subscriptions
            jsonToUpdate.subscriber.subscriptions[productIdentifier] = {
                "expires_date": "9692-01-01T01:01:01Z",
                "original_purchase_date": `${currentISODate}${staticTime}`,
                "purchase_date": `${currentISODate}${staticTime}`,
                "is_sandbox": false,
                "ownership_type": "PURCHASED",
                "store": "app_store"
            };
        }
    }

    body = JSON.stringify(jsonToUpdate);
    $done({ body });
});
