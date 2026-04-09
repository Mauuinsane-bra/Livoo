// lib/amadeus.ts — DEPRECATED. Substituído por lib/skyscrapper.ts
// Mantido apenas como referência histórica.
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck

import Amadeus from 'amadeus'

const amadeus = new Amadeus({
  clientId:     process.env.AMADEUS_CLIENT_ID!,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET!,
  hostname:     'production', // Mudar para 'test' no desenvolvimento
})

export interface FlightSearchParams {
  origin:          string   // IATA code, ex: 'GRU'
  destination:     string   // IATA code, ex: 'CDG'
  departureDate:   string   // 'YYYY-MM-DD'
  returnDate?:     string   // 'YYYY-MM-DD' (opcional para ida e volta)
  adults?:         number   // default: 1
  currencyCode?:   string   // default: 'BRL'
  max?:            number   // max resultados, default: 10
  nonStop?:        boolean  // apenas voos diretos
}

export interface FlightOffer {
  id:            string
  airline:       string
  airlineCode:   string
  origin:        string
  destination:   string
  departureTime: string
  arrivalTime:   string
  duration:      string
  stops:         number
  price:         number
  currency:      string
  link?:         string
}

function parseFlightOffer(offer: Record<string, unknown>): FlightOffer {
  const itineraries = offer.itineraries as Record<string, unknown>[]
  const firstItinerary = itineraries[0]
  const segments = firstItinerary.segments as Record<string, unknown>[]
  const firstSegment = segments[0] as Record<string, unknown>
  const lastSegment  = segments[segments.length - 1] as Record<string, unknown>
  const price = offer.price as Record<string, unknown>
  const firstDep = firstSegment.departure as Record<string, unknown>
  const lastArr  = lastSegment.arrival as Record<string, unknown>
  const validatingAirlineCodes = offer.validatingAirlineCodes as string[]

  return {
    id:            offer.id as string,
    airline:       validatingAirlineCodes?.[0] ?? 'N/A',
    airlineCode:   validatingAirlineCodes?.[0] ?? 'N/A',
    origin:        (firstDep.iataCode as string) ?? '',
    destination:   (lastArr.iataCode as string) ?? '',
    departureTime: new Date(firstDep.at as string).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    arrivalTime:   new Date(lastArr.at as string).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    duration:      (firstItinerary.duration as string)?.replace('PT', '').toLowerCase() ?? '',
    stops:         segments.length - 1,
    price:         parseFloat(price.total as string),
    currency:      price.currency as string,
  }
}

export async function searchFlights(params: FlightSearchParams): Promise<FlightOffer[]> {
  const response = await amadeus.shopping.flightOffersSearch.get({
    originLocationCode:      params.origin,
    destinationLocationCode: params.destination,
    departureDate:           params.departureDate,
    returnDate:              params.returnDate,
    adults:                  params.adults ?? 1,
    currencyCode:            params.currencyCode ?? 'BRL',
    max:                     params.max ?? 10,
    nonStop:                 params.nonStop,
  })
  return (response.data as Record<string, unknown>[]).map(parseFlightOffer)
}

export async function getFlightInspirations(origin: string): Promise<unknown[]> {
  const response = await amadeus.shopping.flightDestinations.get({
    origin,
    maxPrice: 2000,
  })
  return response.data as unknown[]
}
