import React, {useState, useEffect} from 'react'
import axios from 'axios'

const COMPANY = 'H.M. CLAUSE'
const LOCATION = 'Nanyuki, Turaco Farms'
const ADDRESS = '854-1040'
const VEHICLE = 'KBJ 030H'
const DRIVER = 'Stephen'
const POLYPAC_EMAIL = 'polypacrecords@gmail.com'
const KG_PER_TRIP = 2500

export default function Form(){
  const [clientName,setClientName] = useState('')
  const [clientEmail,setClientEmail] = useState('')
  const [wasteType,setWasteType] = useState('Extraction')
  const [trips,setTrips] = useState(1)
  const [quantity,setQuantity] = useState(KG_PER_TRIP)
  const [notes,setNotes] = useState('')
  const [terms,setTerms] = useState(false)
  const [submitting,setSubmitting] = useState(false)
  const [message,setMessage] = useState('')

  useEffect(()=>{
    const q = (Number(trips) || 0) * KG_PER_TRIP
    setQuantity(q)
  },[trips])

  const handleSubmit = async (e)=>{
    e.preventDefault()
    if(!clientEmail || !terms){
      setMessage('Please enter client email and accept terms')
      return
    }
    setSubmitting(true)
    setMessage('Submitting...')
    try{
      const payload = {
        company: COMPANY,
        location: LOCATION,
        address: ADDRESS,
        client_name: clientName,
        client_email: clientEmail,
        waste_type: wasteType,
        trips_collected: Number(trips),
        quantity_kg: quantity,
        vehicle_registration: VEHICLE,
        driver_name: DRIVER,
        notes,
        polypac_email: POLYPAC_EMAIL
      }
      const res = await axios.post('/api/submit', payload)
      setMessage('Submitted! PDF sent to both emails.')
      setSubmitting(false)
    }catch(err){
      setMessage('Submission failed: '+(err?.response?.data?.error||err.message))
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{padding:16,maxWidth:640,margin:'0 auto'}}>
      <div style={{marginBottom:12}}>
        <label>Client contact name</label>
        <input value={clientName} onChange={e=>setClientName(e.target.value)} placeholder="Client name" />
      </div>

      <div style={{marginBottom:12}}>
        <label>Client email *</label>
        <input value={clientEmail} onChange={e=>setClientEmail(e.target.value)} placeholder="client@example.com" type="email" required />
      </div>

      <div style={{marginBottom:12}}>
        <label>Waste type</label>
        <select value={wasteType} onChange={e=>setWasteType(e.target.value)}>
          <option>Extraction</option>
          <option>Prunning Rounds</option>
          <option>GreenHouse Removal</option>
        </select>
      </div>

      <div style={{marginBottom:12}}>
        <label>Trips collected</label>
        <input type="number" min="1" value={trips} onChange={e=>setTrips(e.target.value)} />
      </div>

      <div style={{marginBottom:12}}>
        <label>Quantity (kg)</label>
        <input value={quantity} readOnly />
      </div>

      <div style={{marginBottom:12}}>
        <label>Vehicle registration</label>
        <input value={VEHICLE} readOnly />
      </div>

      <div style={{marginBottom:12}}>
        <label>Driver name</label>
        <input value={DRIVER} readOnly />
      </div>

      <div style={{marginBottom:12}}>
        <label>Additional notes</label>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} />
      </div>

      <div style={{marginBottom:12}}>
        <label>
          <input type="checkbox" checked={terms} onChange={e=>setTerms(e.target.checked)} /> I accept the Terms & Conditions
        </label>
      </div>

      <div>
        <button type="submit" disabled={submitting}>Submit & Generate PDF</button>
      </div>

      <p>{message}</p>
    </form>
  )
}
