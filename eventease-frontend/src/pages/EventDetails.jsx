import React from "react";
import { useParams } from "react-router-dom";
export default function EventDetails() {
  const { id } = useParams();
  return <div style={{ padding: 20 }}><h3>Event: {id}</h3></div>;
}