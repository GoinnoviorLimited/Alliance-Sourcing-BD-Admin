"use client";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useHeroData = () => {
  const { data, error, mutate } = useSWR(`${API_URL}/api/heros`, fetcher);
  return { data, error, isLoading: !data && !error, mutate };
}

export const useWeWorkData = () => {
  const { data, error, mutate } = useSWR(`${API_URL}/api/we-work`, fetcher);
  return { data, error, isLoading: !data && !error, mutate };
}

export const useApartData = () => {
  const { data, error, mutate } = useSWR(`${API_URL}/api/apart`, fetcher);
  return { data, error, isLoading: !data && !error, mutate };
}