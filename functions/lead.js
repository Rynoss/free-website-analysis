'use strict'
const fetch = require('node-fetch');

const requestStage = process.env.stage;

const slack_hook = requestStage === 'dev' ? process.env.dev_slack_hook : process.env.prod_slack_hook
const pd_account = requestStage === 'dev' ? 'ryno-test-sandbox' : 'rynostrategicsolutions-8b7e37';
const pd_account_token = requestStage === 'dev' ? process.env.dev_pipedrive_token : process.env.prod_pipedrive_token;

async function createOrganization( event ) {
  try {
    const details = JSON.parse( event );
    console.log('Creating Organization');

    const org_target = `https://` + pd_account + `.pipedrive.com/v1/organizations?api_token=` + pd_account_token;
    const organization_info = {
      name: details.company
    };

    console.log( organization_info )

    var myOrg = fetch( org_target, {
      method: 'post',
      body: JSON.stringify(organization_info),
      headers: { 'Content-Type': 'application/json' },
    })
    .then( res => res.json())
    .catch( error => console.error(error));

    return myOrg;
  }
  catch(error) {
    console.log( error );
    return error;
  }
}

async function createPerson( event, org ) {
  try {
    const details = JSON.parse( event );

    console.log('Creating Person');

    const person_target = `https://` + pd_account + `.pipedrive.com/v1/persons?api_token=` + pd_account_token;
    const person_info = {
      org_id: org["data"]["id"],
      name: details["name"],
      email: details["email"],    
      phone: details["phone"]
    };

    var myPerson = fetch( person_target, {
      method: 'post',
      body: JSON.stringify(person_info),
      headers: { 'Content-Type': 'application/json' },
    })
    .then( res => res.json())
    .catch( error => console.error(error));
  
    return myPerson;
  }
  catch(error) {
    console.log( error );
    return error;
  }
}


async function createDeal( event, org, person ) {
  try {
    const details = JSON.parse( event );
    console.log('Creating Deal');

    const deal_target = `https://` + pd_account + `.pipedrive.com/v1/deals?api_token=` + pd_account_token;
    var deal_info = {};
    
    if ( requestStage === 'dev' ) {
      var user_selected = '11428603'; // Dev UserID
        
      deal_info = {
        title: "[FWA] " + org["data"]["name"] + " Deal",
        org_id: org["data"]["id"],
        person_id: person["data"]["id"],
        user_id: user_selected,
        "9d547aa47a6298245fe11d2c7d19f39287d41d54": "9",
        "f9b8dfb3357eeaa6ff3aed52ac453951ff41dcd0": details["website"]
      };
    } else {
      var user_selected = ( details["rep"] === null || details["rep"] === '') ? '9078351' : details["rep"]
      
      deal_info = {
        title: "[FWA] " + org["data"]["name"] + " Deal",
        org_id: org["data"]["id"],
        person_id: person["data"]["id"],
        user_id: user_selected,
        "0f33deea72c3df001b962c100a8eb430877934d7": "53",
        "b68980ebf24ae82febc37ce2d81b969ed4876803": details["website"]
      };
    }
    
    var myDeal = fetch( deal_target, {
      method: 'post',
      body: JSON.stringify( deal_info ),
      headers: { 'Content-Type': 'application/json' },
    })
    .then( res => res.json())
    .catch( error => console.error(error));

    return myDeal;
  }
  catch(error) {
    console.log( error );
    return error;
  }
}


async function createNote( event, deal ) {
  try {
    const details = JSON.parse( event );
    console.log('Creating Note');
    
    var content = '';
    
    if  ( typeof details["comments"] !== 'undefined' && details["comments"] !== '' ) {
      content += "<div>";
      content += "<strong>Comments / Notes:</strong><br />";
      content += details["comments"];
      content += "<br />&nbsp;</div>";
    }

    content += "<strong>Top 3 cities in their area:</strong><ol><li>" + details["city1"] + "</li><li>" + details["city2"] + "</li><li>" + details["city3"] + "</li></ol>";

    const note_target = `https://` + pd_account + `.pipedrive.com/v1/notes?api_token=` + pd_account_token;
    const note_info = {
      content: content,
      deal_id: deal["data"]["id"]
    };
    
    var myNote = fetch( note_target, {
      method: 'post',
      body: JSON.stringify( note_info ),
      headers: { 'Content-Type': 'application/json' },
    })
    .then( res => res.json())
    .catch( error => console.error(error));

    return myNote;
  }
  catch(error) {
    console.log( error );
    return error;
  }
}


async function sendNotice( deal ) {
  try {
    console.log('Sending Notice');


    const link = `https://` + pd_account + `.pipedrive.com/deal/` + deal["data"]["id"]
    var content = "<a href=\"" + link + "\" target=\"_blank\" >" + deal["data"]["title"] + "</a>"

    const notice_target = slack_hook;

    const notice_info = {
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": ":heavy_dollar_sign: New Lead Added: <" + link + "|" + deal["data"]["title"] + ">"
          },
          "accessory": {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "View Lead",
              "emoji": true
            },
            "url": link
          }
        }		
      ]
    };
    
    var myNotice = fetch( notice_target, {
      method: 'post',
      body: JSON.stringify( notice_info ),
      headers: { 'Content-Type': 'application/json' },
    })
    .then( res => res.json())
    .catch( error => console.error(error));

    return myNotice;
  }
  catch(error) {
    console.log( error );
    return error;
  }
}

async function createLead(event, context, callback) {
  try {
    let org = await createOrganization( event );
    let person = await createPerson( event, org );
    let deal = await createDeal( event, org, person );
    let note = await createNote( event, deal );


    let notification = await sendNotice( deal );

    var response = {
      statusCode: '200',
      body: JSON.stringify({ success: 'Submitted!' }),
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
      }
    };

    


    callback(null, response);
  }
  catch(error) {
    console.log( error );
    return error;
  }
}


// Noticeable change in function parameters, there is no callback
exports.create = async (event, context, callback) => {
  console.log( "Stage: " + requestStage );
  console.log('Details Received:');
  console.log( event["body"] );
  let result = await createLead( event["body"], context, callback );
  return result;
};