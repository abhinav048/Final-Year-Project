import React, { useEffect, useState } from "react";
import { fetchSellerByAddress, registerSeedBatch, shipOrder, fetchOrders } from "../api";
import { Seller, SeedBatch, Order } from "../types";
import { TrustBadge } from "../components/TrustBadge";
import { TrustExplainability } from "../components/TrustExplainability";
import { TamperCheckModal } from "../components/TamperCheckModal";
import { QRCodeModal } from "../components/QRCodeModal";
import { useLanguage } from "../context/LanguageContext";
import {
  UserCheck,
  PlusCircle,
  Truck,
  CheckCircle2,
  Clock,
  QrCode,
  FileCheck2,
  PackageCheck,
  AlertCircle,
  TrendingUp,
  X,
  Lock,
  ExternalLink
} from "lucide-react";

interface SellerDashboardProps {
  currentAddress: string;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ currentAddress }) => {
  const { t } = useLanguage();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Register Batch Modal State
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formCrop, setFormCrop] = useState("Cereals");
  const [formVariety, setFormVariety] = useState("");
  const [formBatchNo, setFormBatchNo] = useState("");
  const [formManufacturer, setFormManufacturer] = useState("");
  const [formGermination, setFormGermination] = useState(93.5);
  const [formPurity, setFormPurity] = useState(98.8);
  const [formVigor, setFormVigor] = useState(91.2);
  const [formMoisture, setFormMoisture] = useState(11.4);
  const [formPrice, setFormPrice] = useState(0.0035);
  const [formQty, setFormQty] = useState(2500);
  const [formCertText, setFormCertText] = useState(
    "ICAR/NSC Official Seed Testing Laboratory Certificate. Genetic purity 98.8%, germination vigor 93.5%, free from noxious weed seeds."
  );
  const [submittingBatch, setSubmittingBatch] = useState(false);

  // Shipping Modal State
  const [shippingOrder, setShippingOrder] = useState<Order | null>(null);
  const [carrier, setCarrier] = useState("Kisan AgriLogistics Speed Post");
  const [trackingNo, setTrackingNo] = useState("");
  const [submittingShip, setSubmittingShip] = useState(false);

  // Tamper / QR Modal State
  const [activeInspectSeed, setActiveInspectSeed] = useState<SeedBatch | null>(null);
  const [tamperModalOpen, setTamperModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sellerData, ordersData] = await Promise.all([
        fetchSellerByAddress(currentAddress),
        fetchOrders({ seller: currentAddress })
      ]);
      setSeller(sellerData);
      setOrders(ordersData);
    } catch (err: any) {
      console.error("Error loading seller dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentAddress]);

  const handleRegisterBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seller) return;
    setSubmittingBatch(true);
    try {
      await registerSeedBatch({
        sellerId: (seller as any).id || 1,
        name: formName,
        cropType: formCrop,
        variety: formVariety,
        batchNumber: formBatchNo,
        manufacturer: formManufacturer || seller.name,
        harvestDate: new Date().toISOString().split("T")[0],
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        germinationRate: Number(formGermination),
        purity: Number(formPurity),
        vigor: Number(formVigor),
        moistureContent: Number(formMoisture),
        pricePerKg: Number(formPrice),
        availableQuantityKg: Number(formQty),
        certificateText: formCertText
      });
      alert("Seed Lot registered successfully and cryptographic SHA-256 fingerprint anchored on Ethereum!");
      setRegisterModalOpen(false);
      loadData();
    } catch (err: any) {
      alert("Registration failed: " + err.message);
    } finally {
      setSubmittingBatch(false);
    }
  };

  const handleShipOrder = async () => {
    if (!shippingOrder) return;
    setSubmittingShip(true);
    try {
      await shipOrder(shippingOrder.id, {
        carrierName: carrier,
        trackingNumber: trackingNo || `TRK-AGRI-${Math.floor(100000 + Math.random() * 900000)}`
      });
      alert(`Order #${shippingOrder.id} marked as SHIPPED! Delivery confirmation awaited from farmer.`);
      setShippingOrder(null);
      loadData();
    } catch (err: any) {
      alert("Shipping action failed: " + err.message);
    } finally {
      setSubmittingShip(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-100">
        <div className="inline-block w-8 h-8 border-4 border-[#48A741] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 mt-3 font-medium">Loading breeder credentials & listings...</p>
      </div>
    );
  }

  const escrowOrdersPending = orders.filter((o) => o.status === "ESCROWED");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">

      {/* Top Banner: Breeder Profile & Trust Metrics */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0a1f11]/90 border border-[#48A741]/25 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#07130b] text-[#48A741] border border-[#48A741]/30">
              Registered Breeder
            </span>
            {seller?.isVerified ? (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#48A741]/20 text-[#48A741] border border-[#48A741]/40 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                CA Accredited
              </span>
            ) : (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-950/40 text-amber-300 border border-amber-600/40">
                Pending Verification
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#48A741]/20 text-[#48A741] border border-[#48A741]/30">
              Demo Persona
            </span>
          </div>

          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            {seller?.name || "Breeder Dashboard"}
          </h1>
          <p className="text-xs font-mono text-slate-400">
            {currentAddress} • {seller?.location}
          </p>
          <p className="text-xs text-slate-300 max-w-xl">
            {seller?.description}
          </p>
        </div>

        {/* Trust Gauge & Register Batch Action */}
        <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
          <TrustBadge score={seller?.trustScore || 50} riskCategory={seller?.riskCategory} size="lg" />
          <button
            onClick={() => setRegisterModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#48A741] hover:bg-[#3d9136] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#48A741]/25 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t("bStep2Title")}</span>
          </button>
        </div>
      </div>

      {/* Operational Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0a1f11]/90 border border-[#48A741]/25 shadow-md text-center">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Total Orders</p>
          <p className="font-display font-extrabold text-2xl text-white mt-1">{seller?.totalOrders || 0}</p>
          <span className="text-[10px] text-[#48A741] font-semibold">{seller?.successfulOrders || 0} Successful</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#0a1f11]/90 border border-[#48A741]/25 shadow-md text-center">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Certified Batches</p>
          <p className="font-display font-extrabold text-2xl text-[#48A741] mt-1">
            {seller?.certifiedBatchesCount || 0} / {seller?.totalBatchesCount || 0}
          </p>
          <span className="text-[10px] text-slate-400">CA Verified Lots</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#0a1f11]/90 border border-[#48A741]/25 shadow-md text-center">
          <p className="text-[11px] font-bold text-slate-400 uppercase">On-Time Delivery</p>
          <p className="font-display font-extrabold text-2xl text-white mt-1">
            {seller?.totalOrders ? Math.round(((seller.deliveredOrders - seller.delayedOrders * 0.5) / seller.totalOrders) * 100) : 95}%
          </p>
          <span className="text-[10px] text-slate-400">{seller?.delayedOrders || 0} Delays Recorded</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#0a1f11]/90 border border-[#48A741]/25 shadow-md text-center">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Farmer Rating</p>
          <p className="font-display font-extrabold text-2xl text-amber-400 mt-1">
            {seller?.avgFarmerRating ? seller.avgFarmerRating.toFixed(1) : "4.5"} ★
          </p>
          <span className="text-[10px] text-slate-400">{seller?.ratingCount || 0} Verified Reviews</span>
        </div>
      </div>

      {/* Orders To Fulfill Section */}
      <div className="rounded-2xl bg-[#0a1f11]/90 border border-[#48A741]/25 shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-[#48A741]/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <h2 className="font-display font-bold text-base text-white">
              Orders Awaiting Dispatch (Escrow Locked)
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-950/40 text-amber-300 border border-amber-500/30 font-bold text-xs">
            {escrowOrdersPending.length} To Ship
          </span>
        </div>

        {escrowOrdersPending.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400">
            No pending orders waiting for shipment dispatch.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#07130b] text-slate-300 font-semibold border-b border-[#48A741]/20">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Seed Batch</th>
                  <th className="py-3 px-4">Buyer Address</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Escrow Deposit</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#48A741]/10">
                {escrowOrdersPending.map((order) => (
                  <tr key={order.id} className="hover:bg-[#07160d]">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#48A741]">#{order.id}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{order.seedName}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {order.buyerAddress.substring(0, 6)}...{order.buyerAddress.substring(order.buyerAddress.length - 4)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-200">{order.quantityKg} kg</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#48A741]">{order.totalPriceEth} ETH</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setShippingOrder(order)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 ml-auto shadow-sm"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Ship Order</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Registered Seed Batches Table */}
      <div className="rounded-2xl bg-[#0a1f11]/90 border border-[#48A741]/25 shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-[#48A741]/20 flex items-center justify-between">
          <h2 className="font-display font-bold text-base text-white">
            My Registered Seed Lots & Inventories
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            {seller?.batches?.length || 0} Batches Registered
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#07130b] text-slate-300 font-semibold border-b border-[#48A741]/20">
              <tr>
                <th className="py-3 px-4">Lot #</th>
                <th className="py-3 px-4">Seed Name</th>
                <th className="py-3 px-4">Crop Type</th>
                <th className="py-3 px-4">Germination %</th>
                <th className="py-3 px-4">CA Status</th>
                <th className="py-3 px-4">Price / kg</th>
                <th className="py-3 px-4">Available Stock</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#48A741]/10">
              {seller?.batches?.map((batch) => (
                <tr key={batch.id} className="hover:bg-[#07160d]">
                  <td className="py-3.5 px-4 font-mono text-[#48A741] font-bold">{batch.batchNumber}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{batch.name}</td>
                  <td className="py-3.5 px-4 text-slate-300">{batch.cropType}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#48A741]">{batch.germinationRate}%</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${batch.certificationStatus === "Certified"
                          ? "bg-[#48A741]/20 text-[#48A741] border border-[#48A741]/40"
                          : "bg-amber-950/40 text-amber-300 border border-amber-600/40"
                        }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {batch.certificationStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-200">{batch.pricePerKg} ETH</td>
                  <td className="py-3.5 px-4 font-mono text-slate-200">{batch.availableQuantityKg} kg</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setActiveInspectSeed(batch);
                          setTamperModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg border border-[#48A741]/30 text-slate-300 hover:text-white hover:bg-[#48A741]/20"
                        title="Run Tamper Integrity Check"
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setActiveInspectSeed(batch);
                          setQrModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg border border-[#48A741]/30 text-slate-300 hover:text-white hover:bg-[#48A741]/20"
                        title="Display Seed Bag QR Tag"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trust Explainability Breakdown */}
      {seller?.trustDetails && (
        <TrustExplainability explanation={seller.trustDetails} />
      )}

      {/* Register Batch Modal */}
      {registerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-[#07160d] rounded-3xl max-w-2xl w-full border border-[#48A741]/30 shadow-2xl p-6 sm:p-8 space-y-6 my-8 text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-[#48A741]/20">
              <div className="flex items-center gap-2.5">
                <PlusCircle className="w-6 h-6 text-[#48A741]" />
                <h3 className="font-display font-extrabold text-xl text-white">
                  Register New Seed Batch on Chain
                </h3>
              </div>
              <button onClick={() => setRegisterModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterBatch} className="space-y-4 text-xs">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Seed Batch Name:</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Basmati Rice Pusa-1509"
                    className="w-full p-2.5 rounded-xl border border-[#48A741]/30 bg-[#0a1f11] text-white focus:outline-none focus:border-[#48A741]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Crop Category:</label>
                  <select
                    value={formCrop}
                    onChange={(e) => setFormCrop(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#48A741]/30 bg-[#0a1f11] text-white focus:outline-none focus:border-[#48A741]"
                  >
                    <option value="Cereals">Cereals</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Oilseeds">Oilseeds</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Cash Crops">Cash Crops</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Cultivar / Variety:</label>
                  <input
                    type="text"
                    required
                    value={formVariety}
                    onChange={(e) => setFormVariety(e.target.value)}
                    placeholder="e.g. Pusa-1509 Early Maturity"
                    className="w-full p-2.5 rounded-xl border border-[#48A741]/30 bg-[#0a1f11] text-white focus:outline-none focus:border-[#48A741]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Lot / Batch ID:</label>
                  <input
                    type="text"
                    required
                    value={formBatchNo}
                    onChange={(e) => setFormBatchNo(e.target.value)}
                    placeholder="e.g. IN-PB-RCE-2025-220"
                    className="w-full p-2.5 rounded-xl border border-[#48A741]/30 bg-[#0a1f11] text-white focus:outline-none focus:border-[#48A741] font-mono"
                  />
                </div>
              </div>

              {/* Lab Quality Test Parameters */}
              <div className="p-4 rounded-2xl bg-[#0a1f11] border border-[#48A741]/25 space-y-3">
                <p className="font-bold text-[#48A741] uppercase tracking-wider text-[11px]">
                  Laboratory Quality Test Parameters (Audited on Chain)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Germination %</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formGermination}
                      onChange={(e) => setFormGermination(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-[#48A741]/30 bg-[#07130b] text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Genetic Purity %</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formPurity}
                      onChange={(e) => setFormPurity(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-[#48A741]/30 bg-[#07130b] text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Vigor Index %</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formVigor}
                      onChange={(e) => setFormVigor(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-[#48A741]/30 bg-[#07130b] text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Moisture %</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formMoisture}
                      onChange={(e) => setFormMoisture(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-[#48A741]/30 bg-[#07130b] text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Price per kg (ETH):</label>
                  <input
                    type="number"
                    step="0.00001"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#48A741]/30 bg-[#0a1f11] text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Available Quantity (kg):</label>
                  <input
                    type="number"
                    required
                    value={formQty}
                    onChange={(e) => setFormQty(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#48A741]/30 bg-[#0a1f11] text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Lab Certificate Content / Findings:</label>
                <textarea
                  rows={2}
                  value={formCertText}
                  onChange={(e) => setFormCertText(e.target.value)}
                  placeholder="Official accredited laboratory test report summary. Automatically hashed with SHA-256."
                  className="w-full p-2.5 rounded-xl border border-[#48A741]/30 bg-[#0a1f11] text-white font-mono text-[11px]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#48A741]/30 text-slate-300 hover:text-white hover:bg-white/10 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBatch}
                  className="px-6 py-2 rounded-xl bg-[#48A741] hover:bg-[#3d9136] text-white font-bold shadow-md shadow-[#48A741]/25"
                >
                  {submittingBatch ? "Computing Hash & Recording..." : "Register Batch on Chain"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Ship Order Modal */}
      {shippingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#07160d] rounded-2xl max-w-md w-full border border-[#48A741]/30 shadow-2xl p-6 space-y-4 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-[#48A741]/20">
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-400" />
                Dispatch Seed Shipment
              </h3>
              <button onClick={() => setShippingOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Shipping Order #{shippingOrder.id} ({shippingOrder.seedName}, {shippingOrder.quantityKg} kg) to buyer {shippingOrder.buyerAddress.substring(0, 6)}...
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Logistics Carrier Name:</label>
              <input
                type="text"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-[#48A741]/30 bg-[#0a1f11] text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Tracking Consignment Number:</label>
              <input
                type="text"
                value={trackingNo}
                onChange={(e) => setTrackingNo(e.target.value)}
                placeholder="e.g. TRK-AGRI-882910"
                className="w-full p-2.5 text-xs rounded-xl border border-[#48A741]/30 bg-[#0a1f11] text-white font-mono"
              />
            </div>

            <button
              onClick={handleShipOrder}
              disabled={submittingShip}
              className="w-full py-2.5 rounded-xl bg-[#48A741] hover:bg-[#3d9136] text-white font-bold text-xs shadow-md shadow-[#48A741]/25 transition-all"
            >
              {submittingShip ? "Updating State Machine..." : "Confirm Shipment & Notify Farmer"}
            </button>
          </div>
        </div>
      )}

      {/* Inspect Modals */}
      {activeInspectSeed && (
        <>
          <TamperCheckModal
            batchId={activeInspectSeed.id}
            batchNumber={activeInspectSeed.batchNumber}
            seedName={activeInspectSeed.name}
            certificateCID={activeInspectSeed.certificateCID}
            certificateHash={activeInspectSeed.certificateHash}
            isOpen={tamperModalOpen}
            onClose={() => setTamperModalOpen(false)}
          />

          <QRCodeModal
            batchId={activeInspectSeed.id}
            batchNumber={activeInspectSeed.batchNumber}
            seedName={activeInspectSeed.name}
            isOpen={qrModalOpen}
            onClose={() => setQrModalOpen(false)}
          />
        </>
      )}

    </div>
  );
};
