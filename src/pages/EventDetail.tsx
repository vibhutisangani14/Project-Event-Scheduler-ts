import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { EventItem } from "../types/event";


const EventDetail = () => {
  //params;
  const { id } = useParams<{ id: string }>();
  // state with explicit type
  const [event, setEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3001/api/events/${id}`)

      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch event");
        return res.json();
      })

      .then((data: EventItem) => {
        setEvent(data);
      })

      .catch((err) => console.error("Error fetching event:", err));
  }, [id]);

  if (!event) return <p>Loading events...</p>;

  const eventDate = new Date(event.date);
  const defaultPosition: [number, number] = [53.5511, 9.9937]; // Hamburg
  const position: [number, number] =
    event.latitude && event.longitude
      ? [event.latitude, event.longitude]
      : defaultPosition;


  return (
    <div className="p-6 grid grid-cols ">

      <div className="p-10 grid grid-cols-2 gap-10 card-lg bg-neutral transition-background-color text-primary-content rounded-2xl shadow-mdn">

        {/* Event Info */}
        <section>
          {/* 🔗 Back button with Link */}
          <div className="card-actions justify-start">
            <Link to="/" className="btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <g clip-path="url(#clip0_6_13443)">
                  <path d="M11.67 3.86998L9.9 2.09998L0 12L9.9 21.9L11.67 20.13L3.54 12L11.67 3.86998Z" fill="currentColor" />
                </g>
                <defs>
                  <clipPath id="clip0_6_13443">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Back to
            </Link>
          </div>

          <div className="flex items-start space-x-2 mt-6">
            <h1 className="text-3xl font-mono font-bold text-blue-300 whitespace-nowrap mr-10"> 💡 Event:</h1>
            <h1 className="text-3xl font-mono mb-4 text-gray-100">
              {event.title}
            </h1>
          </div> {/*this is event: eventtitle*/}


          <div className="flex items-start space-x-2 mt-6">
            <h1 className="text-3xl font-mono font-bold text-blue-300 whitespace-nowrap mr-14"> 📢 What:</h1>
            <p className="text-xl font-mono text-gray-100">
              {event.description}
            </p>
          </div> {/*this is Description: eventdescription */}

          <div className="flex items-baseline-last space-x-2 mt-6">
            <h1 className="text-3xl font-mono font-bold text-blue-300 whitespace-nowrap mr-14"> 📅 Time:</h1>
            <p className="text-xl font-mono text-gray-100">
              {eventDate.toLocaleString()}
            </p>
          </div> {/*this is time: eventtime*/}


          <div className="flex items-start space-x-2 mt-6 mb-6">
            <h1 className="text-3xl font-mono font-bold text-blue-300 whitespace-nowrap mr-8"> 📍 Where:</h1>
            <p className="text-xl font-mono text-gray-100">
              {event.location}
            </p>
          </div> {/*this is location: eventplace*/}

          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              window.location.href
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline mt-4"
          >
            Share to LinkedIn
          </a>  {/*this is share to linkedin*/}
        </section>


        {/* Map */}
        <section>
          {/* Leaflet Map */}
          <MapContainer
            center={position}
            zoom={13}
            className="bg-black p-4 text-xl rounded-xl"
            style={{ height: "700px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              {...({} as any)}
            />


            <Marker position={position}>
              <Popup>{event.title}</Popup>
            </Marker>
          </MapContainer>
        </section>

      </div >
    </div >
  );
};

export default EventDetail;
