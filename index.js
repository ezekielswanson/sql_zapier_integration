const cca_handler_token = process.env.CCA_HANDLER_TOKEN;

function formatPhoneNumber(phoneNumber) {
    if (!phoneNumber || phoneNumber === null || phoneNumber === "" || phoneNumber.toUpperCase() === "NULL") {
        return null;
    }
    
    let cleaned = phoneNumber.replace(/\D/g, "");
    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return "(" + match[1] + ") " + match[2] + "-" + match[3];
    }
    return phoneNumber;
}

//Getting input values from Zapier
let {
    personId,
    firstName,
    lastName,
    title,
    suffix,
    street,
    city,
    state,
    zip,
    country,
    email,
    phone,
    sendLetter,
    communicationPreference,
    donorFirstName,
    donorLastName,
    donorAge,
    caseType,
    caseNumber,
    caseStatus,
    recipientText
} = inputData;

const upsertContact = async () => {
    const options = {
        method: "POST",
        headers: {
            authorization: `Bearer ${cca_handler_token}`,
            accept: "application/json",
            "content-type": "application/json"
        },
        body: JSON.stringify({
            inputs: [
                {
                    id: personId,
                    idProperty: "test_midwire_person_id",
                    properties: {
                        firstname: firstName,
                        test_midwire_person_id: personId,
                        lastname: lastName,
                        country,
                        address: street,
                        city,
                        state,
                        zip,
                        ...(email && { email }),
                        phone: formatPhoneNumber(phone),
                        midwire_communication_preference: sendLetter === "Yes" ? "Email" : "Mail",
                        midwire_communication_preferences: communicationPreference,
                        donor_s_first_name: donorFirstName,
                        donor_s_last_name: donorLastName,
                        donor_age: donorAge,
                        case_type: caseType,
                        case_status: caseStatus,
                        midwire_case_number: caseNumber,
                        outcome: recipientText
                    }
                }
            ]
        })
    };

    const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert", options);
    const contactSearchRes = await response.json();
    
    if (!contactSearchRes || !contactSearchRes.results) {
        console.log("No results found in response:", contactSearchRes);
        return { success: false, message: "No results found" };
    }
    
    const results = contactSearchRes.results;
    return {
        success: true,
        contactId: results[0]?.id,
        results: results
    };
};


return upsertContact().catch(error => {
    console.error("Error:", error);
    return { success: false, error: error.message };
});



