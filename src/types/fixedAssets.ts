// src/types/fixedAssets.ts

export type AssetStatus = "Active" | "Disposed" | "Archived";
export type DepreciationMethod = "Straight Line";

export interface FixedAsset {
  ID: number;
  companyId: number;
  name: string;
  description: string;
  assetCode: string;
  acquisitionDate: string;
  acquisitionCost: number;
  status: AssetStatus;
  depreciationMethod: DepreciationMethod;
  usefulLifeInMonths: number;
  salvageValue: number;
  assetAccountId: number;
  accumulatedDepreciationAccountId: number;
  depreciationExpenseAccountId: number;
  createdById: number;
  CreatedAt: string;
  UpdatedAt: string;
  imageUrl: string;
  depreciationHistory?: DepreciationLog[];
}

export interface DepreciationLog {
  ID: number;
  FixedAssetID: number;
  depreciationDate: string;
  amount: number;
  journalReference: string;
  CreatedAt: string;
}

export type NewFixedAssetPayload = Omit<FixedAsset, 'ID' | 'companyId' | 'assetCode' | 'status' | 'createdById' | 'CreatedAt' | 'UpdatedAt' | 'depreciationHistory'>;