const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const PDFDocument = require('pdfkit')
const nodemailer = require('nodemailer')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.sendgrid.net'
const SMTP_PORT = Number(process.env.SMTP_PORT || 587)

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS }
})

function generatePDFBuffer(data){
  return new Promise((resolve,reject)=>{
    const doc = new PDFDocument({margin:40})
    const buffers = []
    doc.on('data', buffers.push.bind(buffers))
    doc.on('end', ()=>{
      const pdfData = Buffer.concat(buffers)
      resolve(pdfData)
    })

    // Header (simple letterhead)
    doc.fontSize(14).text('H.M. CLAUSE', {align:'left'})
    doc.fontSize(10).text('Nanyuki, Turaco Farms - 854-1040')
    doc.moveDown()

    doc.fontSize(12).text('Waste Collection Receipt', {align:'center'})
    doc.moveDown()

    const rows = [
      ['Company', data.company],
      ['Location', data.location],
      ['Address', data.address],
      ['Client name', data.client_name],
      ['Client email', data.client_email],
      ['Waste type', data.waste_type],
      ['Trips collected', String(data.trips_collected)],
      ['Quantity (kg)', String(data.quantity_kg)],
      ['Vehicle', data.vehicle_registration],
      ['Driver', data.driver_name],
      ['Notes', data.notes || '']
    ]

    rows.forEach(r=>{
      doc.fontSize(10).text(r[0]+':', {continued:true})
      doc.font('Helvetica-Bold').text(' '+r[1])
      doc.font('Helvetica')
      doc.moveDown(0.2)
    })

    doc.moveDown()
    doc.text('--- Polypac use only ---')
    doc.fontSize(10).text('Polypac staff name: Stephen')
    doc.text('Designation: Nanyuki, Polypac BSF & Waste Facility')
    doc.text('Staff signature: STEPHEN')

    doc.end()
  })
}

app.post('/api/submit', async (req,res)=>{
  try{
    const payload = req.body
    if(!payload.client_email) return res.status(400).json({error:'client_email required'})

    payload.vehicle_registration = payload.vehicle_registration || 'KBJ 030H'
    payload.driver_name = payload.driver_name || 'Stephen'

    const pdfBuffer = await generatePDFBuffer(payload)

    const mailOptionsClient = {
      from: SMTP_USER,
      to: payload.client_email,
      subject: `H.M. CLAUSE Waste Collection Receipt - ${new Date().toISOString().slice(0,10)}`,
      text: 'Attached is your waste collection receipt (PDF).',
      attachments: [{filename:'waste_receipt.pdf', content: pdfBuffer}]
    }

    const mailOptionsPolypac = {
      from: SMTP_USER,
      to: payload.polypac_email || 'polypacrecords@gmail.com',
      subject: `New Waste Collection Submission - ${payload.client_name || 'Unknown'}`,
      text: 'New submission attached.',
      attachments: [{filename:'waste_receipt.pdf', content: pdfBuffer}]
    }

    await transporter.sendMail(mailOptionsClient)
    await transporter.sendMail(mailOptionsPolypac)

    return res.json({ok:true})
  }catch(err){
    console.error(err)
    return res.status(500).json({error:err.message})
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>console.log('Backend started on',PORT))
