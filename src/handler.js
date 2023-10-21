'use strict';

const AWS = require("aws-sdk");
AWS.config.update({ region: "ap-southeast-1"});
let responseBody = "";
let statusCode = 0;

module.exports.GetDeliveryEvent = async (event) => {
  console.log(event);
  // create connection to dynamodb
  const documentClient = new AWS.DynamoDB.DocumentClient({ region: "ap-southeast-1"});

  /*Get tracking ID from frontend */ 
  let tracking = "";

  if (event.queryStringParameters && event.queryStringParameters.tracking) {
        console.log("Received name: " + event.queryStringParameters.tracking);
        tracking = event.queryStringParameters.tracking;
  }

  // setting filter expressions 
  var params = {
    TableName: "DeliveryEvents",
    KeyConditionExpression: "#TID = :t",
    ExpressionAttributeNames:{
      "#TID": "TrackingID"
    },
    ExpressionAttributeValues: {
      ":t": tracking
    }
  };

  try {
    const data = await documentClient.query(params).promise();
    responseBody = JSON.stringify(data.Items);
    statusCode= 200;
    //sendRes(200, data.Items);
  } catch (err) {
    responseBody = `Unable to get Delivery Events: ${err}`;
    statusCode = 403;
    /*sendRes(403, 
      {
        "message": `Unable to get Delivery Events: ${err}`,
        "input": tracking
      }
    );*/
  }
  console.log(responseBody);
  const response = {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
      "access-control-allow-origin": "*"
    },
    body: responseBody
  };
  console.log(response);
  return response;

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

const sendRes = (status, body) => {
  var response = {
      "statusCode": status,
      "headers": {
        "Content-Type": "application/json",
        "access-control-allow-origin": "*"
      },
      "body": JSON.stringify(body),
      "isBase64Encoded": false
  };
  console.log(response);
  return response;
};
