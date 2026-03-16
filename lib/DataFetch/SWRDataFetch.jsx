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

export const useBuyingHouseData = () => {
  const { data, error, mutate } = useSWR(`${API_URL}/api/buying-house`, fetcher);
  return { data, error, isLoading: !data && !error, mutate };
}

export const useEstablishedExcellenceData = () => {
  const { data, error, mutate } = useSWR(`${API_URL}/api/established-excellence`, fetcher);
  return { data, error, isLoading: !data && !error, mutate };
}

export const useContactData = () => {
  const { data, error, mutate } = useSWR(`${API_URL}/api/contact`, fetcher);
  return { data, error, isLoading: !data && !error, mutate };
}

export const useAdvanceMachineryData = () => {
  const { data, error, mutate } = useSWR(`${API_URL}/api/advance-machinery`, fetcher);
  return { data, error, isLoading: !data && !error, mutate };
}

export const useMachineryInventoryData = () => {
  const { data, error, mutate } = useSWR(`${API_URL}/api/machinery-inventory`, fetcher);
  return { data, error, isLoading: !data && !error, mutate };
}

export const useFactoryInfoData = () => {
  const { data, error, mutate } = useSWR(`${API_URL}/api/factory-info`, fetcher);
  return { data, error, isLoading: !data && !error, mutate };
}

export const useProductsData = () => {
  const { data, error, mutate } = useSWR(`${API_URL}/api/products`, fetcher);
  return { data, error, isLoading: !data && !error, mutate };
}

export const useCatalogData = () => {
  const { data, error, mutate } = useSWR(`${API_URL}/api/catalog`, fetcher);
  return { data, error, isLoading: !data && !error, mutate };
}

export const useServicesData = () => {
  const { data, error, mutate } = useSWR(`${API_URL}/api/services`, fetcher);
  return { data, error, isLoading: !data && !error, mutate };
}