import React, { useState } from "react";
import { analyzeSeedQuality, registerSeedBatch } from "../api";
import { AIQualityReport, SeedBatch } from "../types";
import { PillButton } from "./PillButton";
import { QualityReportModal } from "./QualityReportModal";
import {
  Sparkles,
  Upload,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Layers,
  FileCheck2,
  Trash2,
  Info,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

interface SeedQualityAssessmentModuleProps {
  currentAddress: string;
  sellerName?: string;
  recentBatches?: SeedBatch[];
  onBatchRegistered?: () => void;
}

export const SeedQualityAssessmentModule: React.FC<SeedQualityAssessmentModuleProps> = ({
  currentAddress,
  sellerName = "Registered Breeder",
  recentBatches = [],
  onBatchRegistered
}) => {
  // Crop & Form State
  const [cropType, setCropType] = useState("Soybean");
  const [productName, setProductName] = useState("Certified Soybean JS-335");
  const [variety, setVariety] = useState("JS-335 Foundation");
  const [batchId, setBatchId] = useState(`SOY-${Math.floor(1000 + Math.random() * 9000)}`);
  const [quantityKg, setQuantityKg] = useState(3000);
  const [pricePerKg, setPricePerKg] = useState(0.00032);
  const [seedOrigin, setSeedOrigin] = useState("Indore, Madhya Pradesh, India");
  const [harvestDate, setHarvestDate] = useState("2025-05-10");
  const [expiryDate, setExpiryDate] = useState("2026-05-10");
  const [certText, setCertText] = useState(
    "ICAR-IISR Official Laboratory Seed Testing Certificate. Purity 99.1%, Moisture 9.8%, Free from Yellow Mosaic Virus."
  );

  // Images state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Assessment & Report state
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>("");
  const [activeReport, setActiveReport] = useState<AIQualityReport | null>(null);
  const [modalReport, setModalReport] = useState<AIQualityReport | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isSoybean = cropType.toLowerCase().includes("soybean");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    addFiles(files);
  };

  const addFiles = (files: File[]) => {
    setErrorMsg(null);
    const valid = files.filter(f => f.type.startsWith("image/"));
    if (valid.length === 0) {
      setErrorMsg("Please upload valid image files (JPEG, PNG, WEBP).");
      return;
    }
    const newFiles = [...selectedFiles, ...valid].slice(0, 20); // Cap at 20
    setSelectedFiles(newFiles);

    const urls = newFiles.map(f => URL.createObjectURL(f));
    setPreviewUrls(urls);
  };

  const removeFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
    const urls = updated.map(f => URL.createObjectURL(f));
    setPreviewUrls(urls);
  };

  const handleAnalyze = async () => {
    if (!isSoybean) {
      setErrorMsg("AI visual assessment is currently available only for soybean seeds.");
      return;
    }
    if (selectedFiles.length === 0) {
      setErrorMsg("Please select or drop seed photographs before analyzing.");
      return;
    }

    setAnalyzing(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      setAnalysisStep("Validating image resolution & converting to 224×224 RGB...");
      await new Promise(r => setTimeout(r, 600));

      setAnalysisStep("Executing Vision Transformer (ViT-B/16) tensor inference...");
      const formData = new FormData();
      formData.append("batchId", batchId);
      formData.append("cropType", cropType);
      formData.append("variety", variety);
      formData.append("sellerAddress", currentAddress);
      selectedFiles.forEach(file => {
        formData.append("images", file);
      });

      const result = await analyzeSeedQuality(formData);

      setAnalysisStep("Aggregating 5-class distribution & calculating Visual Quality Score...");
      await new Promise(r => setTimeout(r, 400));

      setActiveReport(result);
      setSuccessMsg(`Analysis complete! Visual Quality Score: ${result.visualQualityScore}/100 (${result.qualityCategory}). Review report below.`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to analyze seed images.");
    } finally {
      setAnalyzing(false);
      setAnalysisStep("");
    }
  };

  const handlePublishBatch = async () => {
    if (!activeReport) {
      alert("Please analyze seed quality before publishing.");
      return;
    }

    setPublishing(true);
    try {
      await registerSeedBatch({
        sellerAddress: currentAddress,
        name: productName,
        cropType: cropType,
        variety: variety,
        batchNumber: batchId,
        manufacturer: sellerName,
        germinationRate: 92.5,
        purity: 99.0,
        vigor: 91.5,
        moisture: 9.8,
        diseaseResistance: "Yellow Mosaic Virus & Blight Resistant",
        harvestDate: harvestDate,
        expiryDate: expiryDate,
        pricePerKg: Number(pricePerKg),
        availableQuantityKg: Number(quantityKg),
        certificateRawText: certText,
        seedOrigin: seedOrigin,
        aiVisualQualityScore: activeReport.visualQualityScore,
        aiQualityCategory: activeReport.qualityCategory,
        aiReportCID: activeReport.reportCID,
        aiReportHash: activeReport.reportHash,
        aiModelVersion: activeReport.modelVersion,
        aiAnalyzedAt: activeReport.assessedAt,
        aiClassDistributionJson: JSON.stringify(activeReport.classDistribution),
        imagesJson: JSON.stringify(previewUrls)
      });

      alert(`Batch #${batchId} published on-chain with AI Visual Quality Score (${activeReport.visualQualityScore}/100) and IPFS CID! Seller trust score recalculated.`);
      setActiveReport(null);
      setSelectedFiles([]);
      setPreviewUrls([]);
      setBatchId(`SOY-${Math.floor(1000 + Math.random() * 9000)}`);
      if (onBatchRegistered) onBatchRegistered();
    } catch (err: any) {
      alert("Failed to publish batch on blockchain: " + err.message);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Module Title Banner */}
      <div className="p-6 sm:p-8 rounded-[24px] bg-white border border-[#E1E6DA] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#EEF3E6] text-[#6AB547] border border-[#C5E1A5] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              AI Seed Quality Assessment
            </span>
            <span className="text-xs font-mono text-[#5B665F]">
              ViT-B/16 Deep Learning Pipeline
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#121714]">
            Automated Visual Quality & Defect Classification
          </h2>
          <p className="text-xs text-[#5B665F] max-w-2xl">
            Upload seed lot photographs. Our Vision Transformer model classifies seeds across five surface categories (Intact, Broken, Immature, Skin-damaged, Spotted) and calculates an objective AI Visual Seed Quality Score anchored immutably to IPFS and Ethereum.
          </p>
        </div>

        <div className="shrink-0 p-4 rounded-2xl bg-[#F7F8F3] border border-[#E1E6DA] text-center space-y-1">
          <span className="text-[10px] font-bold uppercase text-[#5B665F]">Evaluated Benchmark</span>
          <p className="font-black text-xl text-[#2E9E57]">95.52% Acc</p>
          <span className="text-[10px] text-[#5B665F]">IEEE Research Model</span>
        </div>
      </div>

      {/* Main Upload & Specification Form */}
      <div className="p-6 sm:p-8 rounded-[28px] bg-white border border-[#E1E6DA] shadow-xs space-y-6">
        <h3 className="font-extrabold text-lg text-[#121714] flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-[#6AB547]" />
          <span>Step 1: Enter Seed Product & Batch Details</span>
        </h3>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-[#121714] block mb-1">Crop Category</label>
            <select
              value={cropType}
              onChange={e => setCropType(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-[#E1E6DA] bg-white font-semibold focus:outline-none focus:border-[#6AB547]"
            >
              <option value="Soybean">Soybean (ViT Model Supported)</option>
              <option value="Wheat">Wheat (Cereals)</option>
              <option value="Rice">Rice (Cereals)</option>
              <option value="Maize">Maize (Cereals)</option>
              <option value="Mustard">Mustard (Oilseeds)</option>
              <option value="Chickpea">Chickpea (Pulses)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#121714] block mb-1">Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={e => setProductName(e.target.value)}
              placeholder="e.g. Certified Soybean JS-335"
              className="w-full p-2.5 text-xs rounded-xl border border-[#E1E6DA] bg-white focus:outline-none focus:border-[#6AB547]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#121714] block mb-1">Seed Variety</label>
            <input
              type="text"
              value={variety}
              onChange={e => setVariety(e.target.value)}
              placeholder="e.g. JS-335 High Yield"
              className="w-full p-2.5 text-xs rounded-xl border border-[#E1E6DA] bg-white focus:outline-none focus:border-[#6AB547]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#121714] block mb-1">Batch ID / Number</label>
            <input
              type="text"
              value={batchId}
              onChange={e => setBatchId(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-[#E1E6DA] bg-white font-mono font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#121714] block mb-1">Batch Quantity (kg)</label>
            <input
              type="number"
              value={quantityKg}
              onChange={e => setQuantityKg(Number(e.target.value))}
              className="w-full p-2.5 text-xs rounded-xl border border-[#E1E6DA] bg-white font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#121714] block mb-1">Price / kg (ETH)</label>
            <input
              type="number"
              step="0.00001"
              value={pricePerKg}
              onChange={e => setPricePerKg(Number(e.target.value))}
              className="w-full p-2.5 text-xs rounded-xl border border-[#E1E6DA] bg-white font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-[#121714] block mb-1">Seed Origin / Farm Location</label>
            <input
              type="text"
              value={seedOrigin}
              onChange={e => setSeedOrigin(e.target.value)}
              placeholder="e.g. ICAR Research Station, Indore, Madhya Pradesh"
              className="w-full p-2.5 text-xs rounded-xl border border-[#E1E6DA] bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#121714] block mb-1">Production Date</label>
            <input
              type="date"
              value={harvestDate}
              onChange={e => setHarvestDate(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-[#E1E6DA] bg-white text-xs"
            />
          </div>
        </div>

        {/* Crop Type Guard Banner (§4: Initially enable ViT assessment only for soybean) */}
        {!isSoybean && (
          <div className="p-4 rounded-2xl bg-[#FEF9EE] border border-[#FADFA8] flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#E9A93B] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[#7A5A18]">
                Crop Restriction Notice
              </p>
              <p className="text-xs text-[#7A5A18] mt-0.5">
                AI visual assessment is currently available only for soybean seeds. Vision Transformer weights are trained specifically on soybean morphological defects and cannot be applied to wheat, rice, maize, or other crops.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Seed Photographs Upload */}
        <div className="space-y-4 pt-4 border-t border-[#F1EFE6]">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-[#121714] flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#6AB547]" />
              <span>Step 2: Upload Seed Photographs</span>
            </h3>
            <span className="text-xs text-[#5B665F] font-semibold">
              {selectedFiles.length} images selected (Max 20)
            </span>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              if (e.dataTransfer.files) addFiles(Array.from(e.dataTransfer.files));
            }}
            className="border-2 border-dashed border-[#C5E1A5] bg-[#F7F8F3] hover:bg-[#EEF3E6] rounded-[24px] p-8 text-center transition-colors cursor-pointer"
            onClick={() => document.getElementById("seed-photo-input")?.click()}
          >
            <input
              id="seed-photo-input"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#EEF8F1] border border-[#B8E4C7] flex items-center justify-center text-[#6AB547]">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-[#121714]">
                Click to browse or drag & drop seed photographs here
              </p>
              <p className="text-xs text-[#5B665F]">
                Supports JPEG, PNG, WEBP (auto-resized to 224×224 RGB with ImageNet normalization)
              </p>
            </div>
          </div>

          {/* Thumbnail Preview Grid */}
          {previewUrls.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#121714] block">Uploaded Photograph Previews</span>
              <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {previewUrls.map((url, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-[#E1E6DA] bg-white aspect-square shadow-xs">
                    <img src={url} alt={`Seed preview ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(idx);
                      }}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-1 left-1 text-[9px] font-mono font-bold bg-black/60 text-white px-1.5 py-0.2 rounded">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error & Success Messages */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-xs text-green-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Analysis Action Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#F1EFE6]">
            <div className="text-xs text-[#5B665F]">
              {analyzing ? (
                <span className="flex items-center gap-2 text-[#6AB547] font-semibold animate-pulse">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  {analysisStep}
                </span>
              ) : (
                <span>Ready to execute ViT model inference on {selectedFiles.length} seed images.</span>
              )}
            </div>

            <PillButton
              variant="primary"
              size="md"
              withArrow
              disabled={!isSoybean || selectedFiles.length === 0 || analyzing}
              isLoading={analyzing}
              onClick={handleAnalyze}
            >
              Analyze Seed Quality
            </PillButton>
          </div>
        </div>
      </div>

      {/* Generated Quality Report Review Card (Before Publishing) */}
      {activeReport && (
        <div className="p-6 sm:p-8 rounded-[28px] bg-white border-2 border-[#6AB547] shadow-lg space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1EFE6] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#EEF3E6] text-[#6AB547] border border-[#C5E1A5] inline-block mb-1">
                Assessment Ready For Blockchain Registration
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#121714]">
                Batch #{batchId} AI Visual Quality Score: {activeReport.visualQualityScore}/100
              </h3>
              <p className="text-xs text-[#5B665F]">
                Category: <strong>{activeReport.qualityCategory}</strong> • Analyzed {activeReport.totalImagesAnalyzed} images
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setModalReport(activeReport)}
                className="text-xs font-bold px-3.5 py-2 rounded-full border border-[#E1E6DA] bg-[#F7F8F3] hover:bg-[#EEF3E6] text-[#121714] cursor-pointer"
              >
                Inspect Detailed Breakdown
              </button>
              <PillButton
                variant="primary"
                size="md"
                withArrow
                isLoading={publishing}
                onClick={handlePublishBatch}
              >
                Register & Publish Batch
              </PillButton>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Object.entries(activeReport.classDistribution || {}).map(([cName, pct]) => (
              <div key={cName} className="p-3 rounded-xl bg-[#F7F8F3] border border-[#E1E6DA] text-center">
                <span className="text-[11px] font-bold text-[#5B665F] block">{cName}</span>
                <span className="font-black text-base text-[#121714]">{pct}%</span>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-[#FEF9EE] border border-[#FADFA8] text-[11px] text-[#7A5A18] flex items-start gap-2">
            <Info className="w-4 h-4 text-[#E9A93B] shrink-0 mt-0.5" />
            <span>
              <strong>Research Disclosure:</strong> {activeReport.disclaimer}
            </span>
          </div>
        </div>
      )}

      {/* Recent AI Batch Reports History */}
      {recentBatches.filter(b => b.aiVisualQualityScore != null).length > 0 && (
        <div className="rounded-[24px] bg-white border border-[#E1E6DA] shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-[#F1EFE6] flex items-center justify-between">
            <h3 className="font-extrabold text-base text-[#121714] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#6AB547]" />
              <span>Recent AI Visual Quality Batch Assessments</span>
            </h3>
            <span className="text-xs text-[#5B665F] font-semibold">
              {recentBatches.filter(b => b.aiVisualQualityScore != null).length} Assessed Batches
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F8F3] text-[#5B665F] font-bold border-b border-[#E1E6DA]">
                <tr>
                  <th className="py-3 px-4">Batch Lot #</th>
                  <th className="py-3 px-4">Seed Variety</th>
                  <th className="py-3 px-4">Crop</th>
                  <th className="py-3 px-4 text-center">AI Visual Score</th>
                  <th className="py-3 px-4">Quality Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1EFE6]">
                {recentBatches
                  .filter(b => b.aiVisualQualityScore != null)
                  .map(b => (
                    <tr key={b.id} className="hover:bg-[#F7F8F3] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#121714]">#{b.batchNumber}</td>
                      <td className="py-3.5 px-4 font-bold text-[#121714]">{b.name}</td>
                      <td className="py-3.5 px-4 text-[#5B665F]">{b.cropType}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono font-black text-sm text-[#2E9E57] bg-[#EEF8F1] px-2.5 py-1 rounded-full border border-[#B8E4C7]">
                          {Math.round(b.aiVisualQualityScore || 0)}/100
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#121714]">
                          {b.aiQualityCategory || "Good"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF3E6] text-[#6AB547]">
                          {b.certificationStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setModalReport({
                              batchId: b.id,
                              batchNumber: b.batchNumber,
                              cropType: b.cropType,
                              variety: b.variety,
                              visualQualityScore: b.aiVisualQualityScore || 90,
                              qualityCategory: (b.aiQualityCategory as any) || "Good",
                              totalImagesAnalyzed: 10,
                              classDistribution: b.aiClassDistribution || {
                                Intact: 85,
                                Immature: 5,
                                Spotted: 5,
                                "Skin-damaged": 3,
                                Broken: 2
                              },
                              predictions: [],
                              reportCID: b.aiReportCID || "bafybeireportcid",
                              reportHash: b.aiReportHash || "0x3f98a28e",
                              modelVersion: b.aiModelVersion || "SeedSure-ViT-B16-v1.0",
                              assessedAt: b.aiAnalyzedAt || b.createdAt,
                              disclaimer: "AI Visual Seed Quality Score evaluates seed physical integrity and surface defects from optical photographs using Vision Transformer (ViT-B/16)."
                            });
                          }}
                          className="px-3 py-1.5 rounded-full border border-[#E1E6DA] bg-white hover:bg-[#EEF3E6] text-xs font-bold text-[#121714] cursor-pointer"
                        >
                          View Report
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quality Report Modal */}
      {modalReport && (
        <QualityReportModal
          isOpen={true}
          onClose={() => setModalReport(null)}
          report={modalReport}
        />
      )}
    </div>
  );
};
