var { google } = require('googleapis'),
  request = require('request'),
  GoogleSpreadsheet = require('google-spreadsheet'),
  creds = require('./client_secret.json'),
  bodyParser = require("body-parser");

const moment = require('moment');
var sleep = require('system-sleep');
const port = process.env.PORT || 40010;


app.use(cors());
app.use(bodyParser.json());


app.get("/read", function (req, res) {
  // Identifying which document we'll be accessing/reading from
  var doc = new GoogleSpreadsheet('1TqAUihLDfMJkCwbvncZSFyYWkadEWAVddAHG5bmA-5M');

  // Authentication
  doc.useServiceAccountAuth(creds, function (err) {

    // Getting cells back from tab #2 of the file
    // doc.getCells(1, callback)
    doc.getRows(1, callback)


    // Callback function determining what to do with the information
    function callback(err, rows) {

      // Logging the output or error, depending on how the request went
      console.log(rows.length)
      console.log(err)
      var last_row = rows.length;

      // Rending the test page while passing in the response data through "rows". Can access specific data points via: rows[i]._value
      res.send({ rows: rows[last_row - 1] })
    }


  });
});


app.get("/update", function (req, res) {


  // Get Last Order number

  // Identifying which document we'll be accessing/reading from
  var doc = new GoogleSpreadsheet('1TqAUihLDfMJkCwbvncZSFyYWkadEWAVddAHG5bmA-5M');

  // Authentication
  doc.useServiceAccountAuth(creds, function (err) {

    // Getting cells back from tab #2 of the file
    // doc.getCells(1, callback)
    doc.getRows(1, callback)


    // Callback function determining what to do with the information
    function callback(err, rows) {

      // Logging the output or error, depending on how the request went
      // console.log(rows.length)
      console.log(err);
      console.log(rows);
      var last_row = rows.length;
      var last_order = rows[last_row - 1];
      var last_order_no = last_order.orderno;
      console.log("last order", last_order, last_order_no);


      // Rending the test page while passing in the response data through "rows". Can access specific data points via: rows[i]._value
      // res.send({rows:rows[last_row-1]})

      // Establish mysql connection here

      var con = mysql.createConnection({
        host: "192.168.18.106",
        user: "nextstage",
        password: "Ksjudyhrtbeoiqyeh",
        database: "asort_plus_db"
      });

      con.connect(function (err) {
        if (err) throw err;
        try {
          con.query(`select order_no, fcid, (net_amount-shipping_charges-tax_amount) as AmountWithoutTaxAndShipping,DATE_FORMAT(created_at, "%a, %b %d, %Y") as created_at, DATE_FORMAT(created_at, "'%H") as houroftheday from orders where order_no>${last_order_no} order by order_no`, function (err, result, fields) {
            if (err) throw err;
             console.log(result);

            // res.send({result})

            if (result) {

              result.map((resultObj) => {
                sleep(8000);
                //resultObj.created_at = moment(resultObj.created_at).format('LLLL');


                var value = { OrderNo: resultObj.order_no, fcid: resultObj.fcid, netamount: resultObj.AmountWithoutTaxAndShipping, createddateonly: resultObj.created_at, capturedat:'InHouse', houroftheday: resultObj.houroftheday };

                // console.log("value", value);

                doc.addRow(1, value, callback)



                // Callback function determining what to do with the information
                function callback(err, resp) {

                  // Logging the output or error, depending on how the request went
                  console.log(resp)
                  console.log(err)

                  // Rending the test page while passing in the response data through "rows". Can access specific data points via: rows[i]._value
                  // res.send({rows:rows})


                  res.send({ resp: resp })


                }

              });

            } else {
              console.log("No results found");
            }

            con.end();

          });

        } catch (e) {
          console.log("An error occurred=>", e);
          con.end();
        }

      });

    }
  });
});



app.listen(port, () => {
  console.log(`Starting server at port ${port}`);
});

module.exports = { app };