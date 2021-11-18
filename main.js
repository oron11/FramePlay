"use strict";

const { Validator } = require('node-input-validator');
const fetch  = require('node-fetch').default;

const VALIDATION_RULES = {
    'user': 'required|object',
    'user.firstName': 'required|string',
    'user.lastName' : 'required|string',
    'user.age': 'required|integer|min:1|max:120',
    'user.email': 'required|email',
    'user.city': 'string|minLength:2' 
};

  const EXTERNAL_HTTP_API  = 'http://check.com/sendData'

  async function validateData(jsonInput) {
      console.log ("Validating input");
      
      const v = new Validator(jsonInput, VALIDATION_RULES);

      const matched = await v.check(jsonInput);
      if (!matched) {
          throw new Error("Validation errors: " + JSON.stringify(v.errors));
      }

      console.log ("Input validated successfully");
  }

  async function sentToHttpApi(jsonInput) {
      console.log ("Sending request to", EXTERNAL_HTTP_API);
      
      const response = await fetch(EXTERNAL_HTTP_API, { 
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(jsonInput)
      });

      if (!response.ok) {
          throw new Error("Failed to fulfill request: " + response.statusText + ", status " + response.status);
      }

      console.log ("Request sent successfully");
  }

  async function main(jsonInput) {
      try {
          console.log('Program started, input received: ', jsonInput);
          
          await validateData(jsonInput);
          await sentToHttpApi(jsonInput);
          
          console.log('Program finished successfully');
      }
      catch (exception) {
          console.error('Program failed', exception);
      }
  }

  const EXTERNAL_JSON_INPUT = { 
      'user' : { 
          firstName: 'John', 
          lastName: 'Due', 
          age: 30,
          email: 'john@gmail.com',
          city: 'Melbourne'
      } 
  };
  
  main(EXTERNAL_JSON_INPUT);