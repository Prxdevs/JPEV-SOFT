const PdfPrinter = require('pdfmake');
const Sale = require('../models/Sale');
const fs = require('fs');
const dateFormat = require('dateformat');

const fonts = {
  Roboto: {
    normal: 'public/fonts/Roboto-Regular.ttf',
    bold: 'public/fonts/Roboto-Medium.ttf',
    italics: 'public/fonts/Roboto-Italic.ttf',
    bolditalics: 'public/fonts/Roboto-Italic.ttf',
  },
};

const printer = new PdfPrinter(fonts);

const docDefinition = (data) => {
  let tableBodyData = [];
  if (data.product) {
    tableBodyData.push([
      {
        text: 'Description',
        style: 'tableHeader',
        alignment: 'center',
        margin: 6,
      },
      {
        text: 'HSN\nSAC',
        style: 'tableHeader',
        alignment: 'center',
        margin: 6,
      },
      {
        text: 'GST',
        style: 'tableHeader',
        alignment: 'center',
        margin: 6,
      },
      {
        text: 'Qty',
        style: 'tableHeader',
        alignment: 'center',
        margin: 6,
      },
      {
        text: 'Rate',
        style: 'tableHeader',
        alignment: 'center',
        margin: 6,
      },
      {
        text: 'Per',
        style: 'tableHeader',
        alignment: 'center',
        margin: 6,
      },
      {
        text: 'Amount (Inc.GST)',
        style: 'tableHeader',
        alignment: 'center',
        margin: 6,
      },
    ]);
    tableBodyData.push([
      {
        text: `Product Name: \n${data.product.name}`,
        style: 'tableText',
        margin: 5,
      },
      {
        text: `#`,
        style: 'tableText',
        alignment: 'center',
        margin: 5,
      },
      {
        text: `5%`,
        style: 'tableText',
        alignment: 'center',
        margin: 5,
      },
      {
        text: `${data.quantity.toLocaleString()}`,
        style: 'tableText',
        alignment: 'center',
        margin: 5,
      },
      {
        text: `${data.rate.toLocaleString()}`,
        style: 'tableText',
        alignment: 'center',
        margin: 5,
      },
      {
        text: `NOS`,
        style: 'tableText',
        alignment: 'center',
        margin: 5,
      },
      {
        text: `${(data.amount).toLocaleString()}`,
        style: 'tableText',
        alignment: 'right',
        margin: 5,
      },
    ]);
  } else {
    tableBodyData.push([
      {
        text: 'Description',
        style: 'tableHeader',
        alignment: 'center',
        margin: 6,
        colSpan: 3,
      },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      // { text: '' },
      {
        text: 'Amount (Inc.GST)',
        style: 'tableHeader',
        alignment: 'center',
        margin: 6,
      },
    ]);
  }

  if (data.shippingCost) {
    tableBodyData.push([
      {
        text: 'Shipping Cost',
        style: 'tableText',
        margin: 5,
        colSpan: 6,
      },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      

      {
        text: `${data.shippingCost.toLocaleString()}`,
        style: 'tableText',
        alignment: 'right',
        margin: 5,
      },
    ]);
  }

  if (data.discount) {
    tableBodyData.push([
      {
        text: 'Discount',
        style: 'tableText',
        margin: 5,
        colSpan: 6,
      },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      
      {
        text: `- ${data.discount.toLocaleString()}`,
        style: 'tableText',
        alignment: 'right',
        margin: 5,
      },
    ]);
  }

  if (data.rate * data.quantity) {
    tableBodyData.push([
      {
        text: 'Net Bill (exc.GST)',
        style: 'tableText',
        margin: 5,
        colSpan: 6,
      },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      // { text: '' },
      {
        text: `${(
          data.rate * data.quantity -
          data.discount +
          data.shippingCost
        ).toLocaleString()}`,
        style: 'tableText',
        alignment: 'right',
        margin: 5,
      },
    ]);
  }
  tableBodyData.push([
    {
      text: 'SGST',
      style: 'tableText',
      margin: 5,
      colSpan: 6,
    },
    { text: '' },
    { text: '' },
    { text: '' },
    { text: '' },
    { text: '' },
    // { text: '' },
    {
      text: `${((data.rate * data.quantity - data.discount) * 2.5 / 100).toLocaleString()}`,

      style: 'tableText',
      alignment: 'right',
      margin: 5,
    },
  ]);
  tableBodyData.push([
    {
      text: 'CGST',
      style: 'tableText',
      margin: 5,
      colSpan: 6,
    },
    { text: '' },
    { text: '' },
    { text: '' },
    { text: '' },
    { text: '' },
    // { text: '' },
    {
      text: `${((data.rate * data.quantity - data.discount) * 2.5 / 100).toLocaleString()}`,
      style: 'tableText',
      alignment: 'right',
      margin: 5,
    },
  ]);
  tableBodyData.push([
    {
      text: 'Total Amount',
      style: 'tableText',
      margin: 5,
      colSpan: 6,
    },
    { text: '' },
    { text: '' },
    { text: '' },
    { text: '' },
    { text: '' },
    // { text: '' },
    {
      text: `${(data.amount).toLocaleString()}`,
      style: 'tableText',
      alignment: 'right',
      margin: 5,
    },
  ]);
  if (data.paid) {
    tableBodyData.push([
      {
        text: 'Paid',
        style: 'tableText',
        margin: 5,
        colSpan: 6,
      },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      // { text: '' },
      {
        text: `${data.paid.toLocaleString()}`,
        style: 'tableText',
        alignment: 'right',
        margin: 5,
      },
    ]);
  }

  if (
    data.rate * data.quantity - data.discount + data.shippingCost - data.paid >
    0
  ) {
    tableBodyData.push([
      {
        text: 'Current Due',
        style: 'tableText',
        margin: 5,
        colSpan: 6,
      },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      // { text: '' },
      {
        text: `(${(
          data.rate * data.quantity -
          data.discount +
          data.shippingCost -
          data.paid
        ).toLocaleString()})`,
        style: 'tableText',
        alignment: 'right',
        margin: 5,
      },
    ]);
  }

  // if (data.customer.due) {
  //   tableBodyData.push([
  //     {
  //       text: 'Previous Due',
  //       style: 'tableText',
  //       margin: 5,
  //       colSpan: 6,
  //     },
  //     { text: '' },
  //     { text: '' },
  //     { text: '' },
  //     { text: '' },
  //     { text: '' },
  //     // { text: '' },

  //     {
  //       text: `(${(
  //         data.customer.due -
  //         (data.rate * data.quantity -
  //           data.discount +
  //           data.shippingCost -
  //           data.paid)
  //       ).toLocaleString()})`,
  //       style: 'tableText',
  //       alignment: 'right',
  //       margin: 5,
  //     },
  //   ]);
  // }

  // if (data.customer.due) {
  //   tableBodyData.push([
  //     {
  //       text: 'Total Due',
  //       style: 'tableText',
  //       margin: 5,
  //       colSpan: 6,
  //     },
  //     { text: '' },
  //     { text: '' },
  //     { text: '' },
  //     { text: '' },
  //     { text: '' },
  //     // { text: '' },
  //     {
  //       text: `(${data.customer.due.toLocaleString()})`,
  //       style: 'tableText',
  //       alignment: 'right',
  //       margin: 5,
  //     },
  //   ]);
  // }

  // if (data.customer.due == 0) {
  //   tableBodyData.push([
  //     {
  //       text: 'Total Due',
  //       style: 'tableText',
  //       margin: 5,
  //       colSpan: 6,
  //     },
  //     { text: '' },
  //     { text: '' },
  //     { text: '' },
  //     { text: '' },
  //     { text: '' },
  //     // { text: '' },
  //     {
  //       text: `(${data.customer.due.toLocaleString()})`,
  //       style: 'tableText',
  //       alignment: 'right',
  //       margin: 5,
  //     },
  //   ]);
  // }

  return {
    content: [
      {
        text: `Issued at: ${dateFormat(data.salesDate, 'mmmm d, yyyy')}`,
        alignment: 'center',
        style: 'lessFocused',
      },

      {
        columns: [
       
          [
            {
              text: 'INVOICE',
              style: 'header',
              alignment: 'right',
            },
          ],
        ],
      },
      {
        table: {
          widths: ['49%', '51%'],// Define the widths of the two columns
          body: [
            [
              {
                image: './public/images/logo.png',
                width: 80,
              },
              {
                text: `Invoice ID:${data.id.slice(-8)}\nNithish complex,\n Sriram nagar,\n Ramsandra road, mulbagal-563131 \n9900991802 \n GST no : 29AJVPJ5981H1ZC`, // Blank cell for the right-side column
                alignment: 'right'
              },
             
            ],
          ],
        },
      },
     
  
      {
        table: {
          widths: ['50%', '20%', '30%'],// Define the widths of the two columns
          body: [
            [
              {
                text: `Customer Name And Address\n${data.customer.name}\n${data.customer.address}\nContact: ${data.customer.phone}\nAADHAR NO:\nPAN NO:`,
                
                alignment: 'left',
              },
              {
                text: 'Invoice Number\nInvoice Date\nHypothication\nDelivery Note No\nBooking Ref\nBooking Date\nMode/Payment\nVin Number\nMotor Number\nCharger Number\nBettery Number\nColour', // Blank cell for the right-side column
              },
              {
                text: `${data.id.slice(-5)}\n${dateFormat(data.salesDate,'dd/mm/yyyy')}\n${data.hypothication}\n${data.deliverynote_no}\n${data.booking_ref}\n${data.booking_date}\n${data.mode_payment}\n${data.vin_number}\n${data.motor_number}\n${data.charger_number}\n${data.battery_number}\n${data.colour}`, // Blank cell for the right-side column
              },
            ],
          ],
        },
      },
 

    
     
      {
        table: {
          widths: [180, 45, 35, 35,50,35,'*'],
          body: tableBodyData,
        },
      },

      {
        table: {
          widths: ['*'],// Define the widths of the two columns
          body: [
            [
              {
                text: `AMOUNT IN WORDS:${data.amt_words} \nBANK DETAILS:${data.bank_details}`,
                alignment: 'left',
              }, 
            ],
          ],
        },
      },

      {
        table: {
          widths: ['*', '*'],// Define the widths of the two columns
          body: [
            [
              {
                text: `ACCOUNT NUMBER:${data.account_no}\nBANK:${data.bank}`,   
                alignment: 'left',
              },
              {
                text: `BRANCH:${data.branch}\nIFSC CODE:${data.ifsc}`,
                alignment: 'left', // Blank cell for the right-side column
              },
              
            ],
          ],
        },
      },

      // {
      //   text: '',
      //   style: 'mt30',
      // },
      {
        text: 'This is a digitally generated Invoice.',
        style: 'lessFocused',
      },
      {
        text: `${data.comment}`,
        style: 'generalText',
      },
      {
        text: '...',
        alignment: 'center',
        style: 'mb30',
      },
      
      {
        columns: [
          {
            text: `Authorized By\n\n\n___________________________\nJPEV BIKES`,
            style: 'generalText',
          },
          {
            text: `Customer Sign\n\n\n___________________________\n${data.customer.name}`,
            style: 'generalText',
            alignment: 'right',
          },
        ],
      },
    ],
    // footer: {
    //   columns: [
    //     {
    //       text: `Authorized By\nPrxdevs`,
    //       style: 'generalText',
          
    //     },
    //     {
    //       text: `Customer Sign\n${data.customer.name}`,
    //       style: 'generalText',
    //       alignment: 'right',
    //     },
    //   ],
    // },
    styles: {
      header: {
        fontSize: 28,
        bold: true,
        color: '#6a60a9',
      },
      lessFocused: {
        fontSize: 11,
        color: '#888',
        lineHeight: 1.4,
      },
      generalText: {
        fontSize: 10,
        color: '#444',
        lineHeight: 1.2,
      },
      title: {
        fontSize: 15,
        bold: 'true',
        color: '#6a60a9',
        lineHeight: 1.4,
      },
      h2: {
        fontSize: 13,
        bold: 'true',
        color: '#555',
        lineHeight: 1.3,
      },
      mb30: {
        marginBottom: 30,
      },
      mt30: {
        marginTop: 30,
      },
      table: {
        marginTop: 30,
        marginBottom: 30,
      },
      tableHeader: {
        fontSize: 13,
        bold: 'true',
        color: '#6a60a9',
      },
      tableText: {
        fontSize: 12,
        color: '#333',
      },
      height0: {
        height: 0,
        lineHeight: 0,
      },
    },
  };
};

const GenerateInvoice = async (id, type) => {
  let sale;
  if (type == 'payment') {
    sale = await Sale.findById(id).populate('customer');
  } else {
    sale = await Sale.findById(id).populate('product').populate('customer');
  }
  let pdfDoc = await printer.createPdfKitDocument(docDefinition(sale));
  if (!fs.existsSync(`files/invoice/${id}.pdf`)) {
    pdfDoc.pipe(fs.createWriteStream(`files/invoice/${id}.pdf`));
    pdfDoc.end();
  }
};

module.exports = GenerateInvoice;
