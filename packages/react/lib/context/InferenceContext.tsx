import { ApiInfo } from "@landingai-js/core";
import { createContext, useContext } from "react";

export type InferenceContextState = ApiInfo & {};

export const initialInferenceContext: InferenceContextState = {
  baseUrl: '',
  endpointId: '',
  key: '',
  secret: '',
};

export const InferenceContext = createContext(initialInferenceContext);

export const useInferenceContext = () => useContext(InferenceContext);