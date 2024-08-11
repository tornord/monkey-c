import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

const StyledApp = styled.div(
  () => css`
    height: 100vh;
    width: 100vw;
  `
);

export function App() {
  const x = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const positions = [
    { lat: 56.31805, lng: -4.0676, name: "Cnoc Brannan" }, // E 272215 N 715882
    { lat: 56.34499, lng: -4.12901, name: "Creag na h-Eararuidh" },
    { lat: 56.35815, lng: -4.07333, name: "Ben Halton" },
    { lat: 56.34164, lng: -4.04414, name: "Blairmore, stig start" },
    { lat: 56.29897, lng: -4.13537, name: "Bäckförgrening" },
    { lat: 56.33391, lng: -4.15814, name: "Stuc Grabh, norr, liten knalle" },
    { lat: 56.35687, lng: -3.9941, name: "Cultybraggan Camp" },
    { lat: 56.31319, lng: -4.0073, name: "Ben Clach" },
    { lat: 56.28105, lng: -4.11566, name: "Uamh Bheag" },
    { lat: 56.29332, lng: -4.06374, name: "Beinn nan Eun" },
  ];
  return (
    <StyledApp>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string}>
        <Map defaultCenter={positions[0]} defaultZoom={12} mapTypeId="terrain">
          {positions.map((position) => (
            <Marker position={position} key={position.name} />
          ))}
        </Map>
      </APIProvider>
    </StyledApp>
  );
}
