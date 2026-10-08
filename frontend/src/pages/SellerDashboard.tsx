import React, { useEffect, useState } from "react";
import { fetchSellerByAddress, registerSeedBatch, shipOrder, fetchOrders } from "../api";
import { Seller, SeedBatch, Order } from "../types";
import { TrustBadge } from "../components/TrustBadge";
import { TrustExplainability } from "../components/TrustExplainability";
import { TamperCheckModal } from "../components/TamperCheckModal";
import { QRCodeModal } from "../components/QRCodeModal";
import { useLanguage } from "../context/LanguageContext";
import { PillButton } from "../components/PillButton";
import { TagPill } from "../components/TagPill";
import { VerifiedBadge } from "../components/VerifiedBadge";
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
  ExternalLink,
  Sparkles,
  Award
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
  const [inspectModalType, setInspectModalType] = useState<"tamper" | "qr" | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const sellerData = await fetchSellerByAddress(currentAddress);
      setSeller(sellerData);
      const ordersData = await fetchOrders({ seller: currentAddress });
      setOrders(ordersData);
    } catch (err: any) {
      console.error("Error loading seller portal:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentAddress]);

  const handleRegisterBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingBatch(true);
    try {
      await registerSeedBatch({
        name: formName || "Certified Wheat HD-3226",
        cropType: formCrop,
        variety: formVariety || "HD-3226 High Yield",
        batchNumber: formBatchNo || `LOT-${Math.floor(1000 + Math.random() * 9000)}`,
        manufacturer: formManufacturer || (seller?.name || "State Seed Farm"),
        germinationRate: Number(formGermination),
        purity: Number(formPurity),
        vigor: Number(formVigor),
        moisture: Number(formMoisture),
        pricePerKg: Number(formPrice),
        quantityAvailableKg: Number(formQty),
        certificateRawText: formCertText,
        diseaseResistance: "Rust & Blight Tolerant",
        sellerAddress: currentAddress
      });

      alert("New seed lot registered on-chain with SHA-256 certificate hash!");
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
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block w-8 h-8 border-3 border-[#6AB547] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-[#5B665F] mt-3 font-semibold">
          Loading breeder credentials & listings...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
      <div className="sheet-surface wave-pattern border border-[#E1E6DA] p-6 sm:p-10 shadow-sheet space-y-8">

        {/* Top Banner: Breeder Profile & Trust Metrics */}
        <div className="p-6 sm:p-8 rounded-[24px] bg-white border border-[#E1E6DA] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#EEF3E6] text-[#6AB547]">
                Registered Breeder
              </span>
              {seller?.isVerified ? (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EEF8F1] text-[#2E9E57] border border-[#B8E4C7] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  CA Accredited
                </span>
              ) : (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FEF9EE] text-[#E9A93B] border border-[#FADFA8]">
                  Pending Verification
                </span>
              )}
            </div>

            <h1 className="font-extrabold text-2xl sm:text-3xl text-[#121714]">
              {seller?.name || "Breeder Dashboard"}
            </h1>
            <p className="text-xs font-mono text-[#5B665F]">
              {currentAddress} • {seller?.location}
            </p>
            <p className="text-xs text-[#5B665F] max-w-xl">
              {seller?.description}
            </p>
          </div>

          {/* Trust Gauge & Register Batch Action */}
          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <TrustBadge score={seller?.trustScore || 50} riskCategory={seller?.riskCategory} size="lg" />
            <PillButton
              variant="primary"
              size="md"
              withArrow
              onClick={() => setRegisterModalOpen(true)}
            >
              <PlusCircle className="w-4 h-4 mr-1 inline" />
              <span>Register New Seed Lot</span>
            </PillButton>
          </div>
        </div>

        {/* Operational Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-[20px] bg-white border border-[#E1E6DA] shadow-xs text-center">
            <p className="text-[11px] font-bold text-[#5B665F] uppercase">Total Orders</p>
            <p className="font-black text-2xl text-[#121714] mt-1">{seller?.totalOrders || 0}</p>
            <span className="text-[10px] text-[#2E9E57] font-semibold">{seller?.successfulOrders || 0} Successful</span>
          </div>
          <div className="p-5 rounded-[20px] bg-white border border-[#E1E6DA] shadow-xs text-center">
            <p className="text-[11px] font-bold text-[#5B665F] uppercase">Certified Batches</p>
            <p className="font-black text-2xl text-[#6AB547] mt-1">
              {seller?.certifiedBatchesCount || 0} / {seller?.totalBatchesCount || 0}
            </p>
            <span className="text-[10px] text-[#5B665F]">CA Verified Lots</span>
          </div>
          <div className="p-5 rounded-[20px] bg-white border border-[#E1E6DA] shadow-xs text-center">
            <p className="text-[11px] font-bold text-[#5B665F] uppercase">On-Time Delivery</p>
            <p className="font-black text-2xl text-[#121714] mt-1">
              {seller?.totalOrders ? Math.round(((seller.deliveredOrders - seller.delayedOrders * 0.5) / seller.totalOrders) * 100) : 95}%
            </p>
            <span className="text-[10px] text-[#5B665F]">{seller?.delayedOrders || 0} Delays Recorded</span>
          </div>
          <div className="p-5 rounded-[20px] bg-white border border-[#E1E6DA] shadow-xs text-center">
            <p className="text-[11px] font-bold text-[#5B665F] uppercase">Farmer Rating</p>
            <p className="font-black text-2xl text-[#E9A93B] mt-1">
              {seller?.avgFarmerRating ? seller.avgFarmerRating.toFixed(1) : "4.5"} ★
            </p>
            <span className="text-[10px] text-[#5B665F]">{seller?.ratingCount || 0} Verified Reviews</span>
          </div>
        </div>

        {/* Incoming Orders Requiring Shipping */}
        <div className="rounded-[24px] bg-white border border-[#E1E6DA] shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-[#F1EFE6] flex items-center justify-between">
            <h2 className="font-extrabold text-base text-[#121714]">
              Escrow Orders Awaiting Dispatch & QR Tagging
            </h2>
            <span className="text-xs text-[#5B665F] font-semibold">
              {orders.filter((o) => o.status === "ESCROWED").length} Orders Locked
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F8F3] text-[#5B665F] font-bold border-b border-[#E1E6DA]">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Seed Batch</th>
                  <th className="py-3 px-4">Buyer Address</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Locked Escrow</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1EFE6]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#F7F8F3] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#121714]">#{o.id}</td>
                    <td className="py-3.5 px-4 font-bold text-[#121714]">{o.seedName || `Lot #${o.batchId}`}</td>
                    <td className="py-3.5 px-4 font-mono text-[#5B665F]">
                      {o.buyerAddress.slice(0, 6)}...{o.buyerAddress.slice(-4)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#121714]">{o.quantityKg} kg</td>
                    <td className="py-3.5 px-4 font-extrabold text-[#121714]">{o.totalPriceEth} ETH</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#EEF3E6] text-[#6AB547]">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {o.status === "ESCROWED" && (
                        <PillButton
                          variant="primary"
                          size="sm"
                          withArrow
                          onClick={() => setShippingOrder(o)}
                        >
                          Ship Order
                        </PillButton>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Breeder Seed Batches Catalogue */}
        <div className="rounded-[24px] bg-white border border-[#E1E6DA] shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-[#F1EFE6] flex items-center justify-between">
            <h2 className="font-extrabold text-base text-[#121714]">
              My Registered Seed Lots on Smart Contract
            </h2>
            <PillButton
              variant="secondary"
              size="sm"
              onClick={() => setRegisterModalOpen(true)}
            >
              + Add Seed Batch
            </PillButton>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F8F3] text-[#5B665F] font-bold border-b border-[#E1E6DA]">
                <tr>
                  <th className="py-3 px-4">Lot #</th>
                  <th className="py-3 px-4">Variety Name</th>
                  <th className="py-3 px-4">Crop</th>
                  <th className="py-3 px-4">Germination</th>
                  <th className="py-3 px-4">Purity</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">QR / Security</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1EFE6]">
                {seller?.batches?.map((b) => (
                  <tr key={b.id} className="hover:bg-[#F7F8F3] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#121714]">#{b.batchNumber}</td>
                    <td className="py-3.5 px-4 font-bold text-[#121714]">{b.name}</td>
                    <td className="py-3.5 px-4 text-[#5B665F]">{b.cropType}</td>
                    <td className="py-3.5 px-4 font-bold text-[#6AB547]">{b.germinationRate}%</td>
                    <td className="py-3.5 px-4 font-bold text-[#121714]">{b.purity}%</td>
                    <td className="py-3.5 px-4">{b.availableQuantityKg} kg</td>
                    <td className="py-3.5 px-4">
                      <VerifiedBadge isValid={b.certificationStatus === "Certified"} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => {
                          setActiveInspectSeed(b);
                          setInspectModalType("qr");
                        }}
                        className="p-1.5 rounded-full border border-[#E1E6DA] hover:bg-[#EEF3E6] text-[#6AB547] cursor-pointer"
                        title="Seed Bag QR Tag"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setActiveInspectSeed(b);
                          setInspectModalType("tamper");
                        }}
                        className="p-1.5 rounded-full border border-[#E1E6DA] hover:bg-[#EEF3E6] text-[#121714] cursor-pointer"
                        title="Test Hash Verification"
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Register Batch Modal with Unit Hints & Validation (§11.4 Rule 3) */}
      {registerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2A1D]/70 backdrop-blur-xs">
          <div className="bg-[#F7F8F3] border border-[#E1E6DA] rounded-[28px] max-w-xl w-full p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setRegisterModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white border border-[#E1E6DA] text-[#5B665F] hover:text-[#121714] flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-black text-[#121714] mb-1">
              Register Seed Batch & Generate QR Tag
            </h3>
            <p className="text-xs text-[#5B665F] mb-4">
              Upload laboratory parameters. The cryptographic SHA-256 fingerprint will be stored immutably on Ethereum.
            </p>

            <form onSubmit={handleRegisterBatch} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#121714] block mb-1">Seed Variety Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Certified Wheat HD-3226"
                    className="w-full p-2.5 text-xs rounded-xl border border-[#E1E6DA] bg-white focus:outline-none focus:border-[#6AB547]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#121714] block mb-1">Crop Category</label>
                  <select
                    value={formCrop}
                    onChange={(e) => setFormCrop(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-[#E1E6DA] bg-white focus:outline-none focus:border-[#6AB547]"
                  >
                    <option value="Cereals">Cereals</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Oilseeds">Oilseeds</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Cash Crops">Cash Crops</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#121714] block mb-1">Germination %</label>
                  <input
                    type="number"
                    step="0.1"
                    min="70"
                    max="100"
                    required
                    value={formGermination}
                    onChange={(e) => setFormGermination(Number(e.target.value))}
                    className="w-full p-2 text-xs rounded-xl border border-[#E1E6DA] bg-white font-mono"
                  />
                  <span className="text-[10px] text-[#5B665F]">usually 80–99%</span>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#121714] block mb-1">Genetic Purity %</label>
                  <input
                    type="number"
                    step="0.1"
                    min="90"
                    max="100"
                    required
                    value={formPurity}
                    onChange={(e) => setFormPurity(Number(e.target.value))}
                    className="w-full p-2 text-xs rounded-xl border border-[#E1E6DA] bg-white font-mono"
                  />
                  <span className="text-[10px] text-[#5B665F]">min 98%</span>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#121714] block mb-1">Price / kg (ETH)</label>
                  <input
                    type="number"
                    step="0.0001"
                    min="0.0001"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full p-2 text-xs rounded-xl border border-[#E1E6DA] bg-white font-mono"
                  />
                  <span className="text-[10px] text-[#5B665F]">≈ ₹{Math.round(formPrice * 280000)}</span>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#121714] block mb-1">Lot Quantity (kg)</label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={formQty}
                    onChange={(e) => setFormQty(Number(e.target.value))}
                    className="w-full p-2 text-xs rounded-xl border border-[#E1E6DA] bg-white font-mono"
                  />
                  <span className="text-[10px] text-[#5B665F]">available stock</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#121714] block mb-1">Laboratory Certificate Document Content</label>
                <textarea
                  rows={3}
                  value={formCertText}
                  onChange={(e) => setFormCertText(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-[#E1E6DA] bg-white font-mono"
                />
                <p className="text-[10px] text-[#5B665F] mt-0.5">
                  The SHA-256 hash of this text is stamped to the blockchain registry for tamper detection.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <PillButton variant="ghost" size="sm" onClick={() => setRegisterModalOpen(false)}>
                  Cancel
                </PillButton>
                <PillButton variant="primary" size="sm" withArrow isLoading={submittingBatch}>
                  Register on Blockchain
                </PillButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shipping Modal */}
      {shippingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2A1D]/70 backdrop-blur-xs">
          <div className="bg-[#F7F8F3] border border-[#E1E6DA] rounded-[28px] max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-[#121714]">Ship Order #{shippingOrder.id}</h3>
            <p className="text-xs text-[#5B665F]">
              Confirm that seed bags have been labeled with the official QR security tag and handed to courier.
            </p>
            <div>
              <label className="text-xs font-bold text-[#121714] block mb-1">Logistics Carrier</label>
              <input
                type="text"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-[#E1E6DA] bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#121714] block mb-1">Tracking Number</label>
              <input
                type="text"
                placeholder="e.g. TRK-AGRI-883921"
                value={trackingNo}
                onChange={(e) => setTrackingNo(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-[#E1E6DA] bg-white font-mono"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <PillButton variant="ghost" size="sm" onClick={() => setShippingOrder(null)}>Cancel</PillButton>
              <PillButton variant="primary" size="sm" withArrow isLoading={submittingShip} onClick={handleShipOrder}>
                Confirm Shipped
              </PillButton>
            </div>
          </div>
        </div>
      )}

      {/* QR & Tamper Modals */}
      {activeInspectSeed && inspectModalType === "qr" && (
        <QRCodeModal
          batchId={activeInspectSeed.id}
          batchNumber={activeInspectSeed.batchNumber}
          seedName={activeInspectSeed.name}
          isOpen={true}
          onClose={() => {
            setActiveInspectSeed(null);
            setInspectModalType(null);
          }}
        />
      )}

      {activeInspectSeed && inspectModalType === "tamper" && (
        <TamperCheckModal
          batchId={activeInspectSeed.id}
          batchNumber={activeInspectSeed.batchNumber}
          seedName={activeInspectSeed.name}
          certificateCID={activeInspectSeed.certificateCID}
          certificateHash={activeInspectSeed.certificateHash}
          isOpen={true}
          onClose={() => {
            setActiveInspectSeed(null);
            setInspectModalType(null);
          }}
        />
      )}
    </div>
  );
};
