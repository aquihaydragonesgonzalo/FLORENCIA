import { Coordinates } from "../types";

export const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
  const R = 6371e3; // metres
  const φ1 = (coord1.lat * Math.PI) / 180;
  const φ2 = (coord2.lat * Math.PI) / 180;
  const Δφ = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const Δλ = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
};

export const formatMinutes = (mins: number): string => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h}h ${m}min`;
  if (h > 0) return `${h}h`;
  return `${m}min`;
};

export const formatTimeRemaining = (targetTimeStr: string): string => {
  const now = new Date();
  const [hours, minutes] = targetTimeStr.split(':').map(Number);
  const target = new Date(now);
  target.setHours(hours, minutes, 0, 0);

  if (target.getTime() < now.getTime()) {
     return "Terminado";
  }

  const diffMs = target.getTime() - now.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHrs > 0) return `${diffHrs}h ${diffMins}m`;
  return `${diffMins}m`;
};

export const calculateDuration = (startStr: string, endStr: string): string => {
  const [startH, startM] = startStr.split(':').map(Number);
  const [endH, endM] = endStr.split(':').map(Number);
  
  let diffMins = (endH * 60 + endM) - (startH * 60 + startM);
  if (diffMins < 0) diffMins += 24 * 60; 

  const hours = Math.floor(diffMins / 60);
  const minutes = diffMins % 60;

  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes} min`;
};

/**
 * Calcula el progreso (0 a 100) entre un rango de tiempo y la hora actual.
 */
export const calculateTimeProgress = (startTime: string, endTime: string): number => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startH, startM] = startTime.split(':').map(Number);
  const startMinutes = startH * 60 + startM;

  const [endH, endM] = endTime.split(':').map(Number);
  const endMinutes = endH * 60 + endM;

  if (currentMinutes < startMinutes) return 0;
  if (currentMinutes >= endMinutes) return 100;

  const totalRange = endMinutes - startMinutes;
  const elapsed = currentMinutes - startMinutes;
  
  return Math.min(100, Math.max(0, (elapsed / totalRange) * 100));
};