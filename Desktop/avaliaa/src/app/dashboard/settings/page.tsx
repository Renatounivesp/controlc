"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button, Card, Badge } from "@/components/ui/Base";
import { QRCodeSVG } from "qrcode.react";
import { Loader2, Download, Copy, Check, Star, Image as ImageIcon, UploadCloud, X } from "lucide-react";
import { Company } from "@/types";
import Wheel from '@uiw/react-color-wheel';
import ShadeSlider from '@uiw/react-color-shade-slider';
import { hexToHsva, hsvaToHex } from '@uiw/color-convert';
import { PaymentButton } from "@/components/PaymentButton";

function CircularColorPicker({ color, onChange }: { color: string, onChange: (hex: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const hsva = hexToHsva(color);

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full cursor-pointer shadow-md border-2 border-border transition-transform hover:scale-105"
        style={{ backgroundColor: color }}
      />
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-14 left-0 z-50 p-4 bg-card border border-border rounded-3xl shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200">
            <Wheel 
              color={hsva}
              onChange={(color) => onChange(hsvaToHex(color.hsva))}
              width={160}
              height={160}
            />
            <ShadeSlider
              hsva={hsva}
              style={{ width: 160, borderRadius: 10 }}
              onChange={(newShade) => onChange(hsvaToHex({ ...hsva, ...newShade }))}
            />
            
            <button onClick={() => setIsOpen(false)} className="w-full py-2 bg-muted rounded-xl text-xs font-bold text-foreground hover:bg-muted/80 transition-colors">
              Pronto
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [bgImageUrl, setBgImageUrl] = useState("");
  const [themePrimary, setThemePrimary] = useState("#8b5cf6");
  const [themeBg, setThemeBg] = useState("#09090b");
  const [themeRadius, setThemeRadius] = useState("rounded-3xl");

  // Upload States
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);

  useEffect(() => {
    async function fetchCompany() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("companies")
        .select("*")
        .eq("owner_id", user.id)
        .single();

      if (data) {
        setCompany(data);
        setName(data.name || "");
        setLogoUrl(data.logo_url || "");
        setBgImageUrl(data.theme_bg_image || "");
        setThemePrimary(data.theme_hex_primary || "#8b5cf6");
        setThemeBg(data.theme_hex_bg || "#09090b");
        setThemeRadius(data.theme_border_radius || "rounded-3xl");
      }
      setLoading(false);
    }
    fetchCompany();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'bg') => {
    if (!e.target.files || e.target.files.length === 0 || !company) return;
    const file = e.target.files[0];
    
    if (type === 'logo') setUploadingLogo(true);
    else setUploadingBg(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${company.id}-${type}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('public_uploads')
      .upload(filePath, file);

    if (uploadError) {
      alert("Erro ao fazer upload da imagem. Tem certeza que rodou o script SQL no Supabase?");
    } else {
      const { data } = supabase.storage.from('public_uploads').getPublicUrl(filePath);
      if (type === 'logo') setLogoUrl(data.publicUrl);
      else setBgImageUrl(data.publicUrl);
    }

    if (type === 'logo') setUploadingLogo(false);
    else setUploadingBg(false);
    
    // Limpa o input file para permitir selecionar o mesmo arquivo se quiser
    e.target.value = "";
  };

  const handleSave = async () => {
    if (!company) return;
    setSaving(true);
    
    const { error } = await supabase
      .from("companies")
      .update({
        name,
        logo_url: logoUrl,
        theme_hex_primary: themePrimary,
        theme_hex_bg: themeBg,
        theme_bg_image: bgImageUrl,
        theme_border_radius: themeRadius
      })
      .eq("id", company.id);
      
    setSaving(false);
    if (!error) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(evaluationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const evaluationUrl = typeof window !== "undefined" ? `${window.location.origin}/${company?.slug}` : "";

  if (loading) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Editor Visual (White-Label)</h1>
        <p className="text-zinc-400 text-sm">Personalize a página de avaliação com a cara da sua marca.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Lado Esquerdo: Controles */}
        <div className="xl:col-span-7 space-y-6">
          {/* Nova Seção: Assinatura */}
          <Card className="p-8 space-y-6 border-white/5 relative overflow-hidden" glow>
            {company?.subscription_status === 'active' || company?.is_lifetime ? (
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl" />
            ) : (
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            )}
            
            <div className="flex items-start justify-between relative z-10">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  Plano Atual: 
                  {company?.is_lifetime ? (
                    <Badge variant="warning">VITALÍCIO</Badge>
                  ) : company?.subscription_status === 'active' ? (
                    <Badge variant="success">PREMIUM</Badge>
                  ) : (
                    <Badge variant="default">BÁSICO</Badge>
                  )}
                </h2>
                <p className="text-sm text-zinc-400 mt-2">
                  {company?.is_lifetime 
                    ? "Você tem acesso vitalício garantido a todas as funcionalidades." 
                    : company?.subscription_status === 'active' 
                      ? "Sua assinatura está ativa. Aproveite todos os recursos ilimitados!"
                      : "Faça o upgrade para liberar avaliações ilimitadas e personalização premium."}
                </p>
              </div>
            </div>

            {!company?.is_lifetime && company?.subscription_status !== 'active' && (
              <div className="pt-4 border-t border-white/5">
                <PaymentButton companyId={company?.id || ''} />
              </div>
            )}
          </Card>

          <Card className="p-8 space-y-6">
            <h2 className="text-xl font-bold border-b border-white/5 pb-4">Dados da Empresa</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Nome Público</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-colors text-foreground"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Logo da Empresa</label>
                <div className="flex gap-2 items-center">
                  <label className="flex-1 bg-muted border border-border rounded-xl px-4 py-3 cursor-pointer hover:border-primary/50 transition-colors flex items-center justify-center gap-2 text-sm text-foreground">
                    {uploadingLogo ? <Loader2 className="animate-spin text-primary" size={18} /> : <UploadCloud size={18} />}
                    {logoUrl ? "Trocar Logo" : "Escolher Imagem (PNG, JPG)"}
                    <input type="file" accept="image/png, image/jpeg, image/jpg" className="hidden" onChange={(e) => handleImageUpload(e, 'logo')} disabled={uploadingLogo} />
                  </label>
                  {logoUrl && (
                    <button onClick={() => setLogoUrl("")} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors flex shrink-0">
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold border-b border-white/5 pb-4 pt-4">Cores e Tema</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Cor Principal (Botão/Estrela)</label>
                <div className="flex items-center gap-4 bg-muted border border-border rounded-2xl p-2 px-3">
                  <CircularColorPicker 
                    color={themePrimary}
                    onChange={(hex) => setThemePrimary(hex)}
                  />
                  <span className="text-foreground font-mono text-sm">{themePrimary}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Cor do Fundo Sólido</label>
                <div className="flex items-center gap-4 bg-muted border border-border rounded-2xl p-2 px-3">
                  <CircularColorPicker 
                    color={themeBg}
                    onChange={(hex) => setThemeBg(hex)}
                  />
                  <span className="text-foreground font-mono text-sm">{themeBg}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-muted-foreground">Imagem de Fundo (Opcional - Sobrepõe a cor sólida)</label>
              <div className="flex gap-2 items-center">
                <label className="flex-1 bg-muted border border-border rounded-xl px-4 py-3 cursor-pointer hover:border-primary/50 transition-colors flex items-center justify-center gap-2 text-sm text-foreground">
                  {uploadingBg ? <Loader2 className="animate-spin text-primary" size={18} /> : <ImageIcon size={18} />}
                  {bgImageUrl ? "Trocar Fundo" : "Escolher Fundo (Opcional)"}
                  <input type="file" accept="image/png, image/jpeg, image/jpg" className="hidden" onChange={(e) => handleImageUpload(e, 'bg')} disabled={uploadingBg} />
                </label>
                {bgImageUrl && (
                  <button onClick={() => setBgImageUrl("")} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors flex shrink-0">
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="text-sm font-medium text-muted-foreground">Arredondamento dos Cartões</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "rounded-none", label: "Quadrado" },
                  { value: "rounded-xl", label: "Suave" },
                  { value: "rounded-[2rem]", label: "Arredondado" },
                ].map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setThemeRadius(style.value)}
                    className={`py-3 px-4 text-sm border transition-all ${style.value} ${
                      themeRadius === style.value 
                        ? "bg-primary/20 border-primary text-primary font-medium" 
                        : "bg-muted border-border text-muted-foreground hover:border-foreground/20"
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={handleSave} disabled={saving} className={`w-full mt-4 h-12 text-base font-bold transition-colors ${isSaved ? 'bg-green-500 hover:bg-green-600 text-white' : ''}`}>
              {saving ? <Loader2 className="animate-spin mx-auto" /> : isSaved ? "Salvo!" : "Salvar Aparência"}
            </Button>
          </Card>

          {/* QR Code Movid para baixo */}
          <Card className="p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="bg-white p-4 rounded-2xl shrink-0">
              <QRCodeSVG value={evaluationUrl} size={120} level="H" />
            </div>
            <div className="space-y-4 w-full text-center md:text-left">
              <div>
                <h3 className="text-lg font-bold">Seu Link Público</h3>
                <p className="text-sm text-zinc-400">Use este QR Code ou link no balcão da loja.</p>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted border border-border rounded-xl text-xs font-mono text-muted-foreground overflow-hidden">
                <span className="truncate flex-1">{evaluationUrl}</span>
                <button onClick={copyToClipboard} className="text-foreground hover:text-blue-400 transition-colors p-1 shrink-0">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Lado Direito: Live Preview Celular */}
        <div className="xl:col-span-5 flex justify-center sticky top-8">
          <div 
            className="relative w-[340px] h-[700px] border-[10px] border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col transition-all duration-500 bg-cover bg-center" 
            style={{ 
              backgroundColor: themeBg,
              backgroundImage: bgImageUrl ? `url(${bgImageUrl})` : 'none'
            }}
          >
            {/* Overlay escura para a imagem de fundo caso seja muito clara */}
            {bgImageUrl && <div className="absolute inset-0 bg-black/40 pointer-events-none z-0" />}

            {/* Câmera Notão Celular */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-900 rounded-b-2xl z-50"></div>
            
            {/* Conteúdo do Preview */}
            <div className="flex-1 overflow-y-auto p-6 pt-16 flex flex-col items-center justify-center relative z-10">
              {!bgImageUrl && <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />}
              
              <div className="w-full relative">
                <div className="text-center mb-8">
                  <div className="inline-block mb-4 relative">
                    {logoUrl ? (
                      <div className="h-16 w-16 relative mx-auto bg-white/10 backdrop-blur-sm p-1 rounded-2xl shadow-xl">
                        <img src={logoUrl} alt="Logo" className="w-full h-full object-contain drop-shadow-md rounded-xl" />
                      </div>
                    ) : (
                      <div className="p-3 rounded-2xl mx-auto flex items-center justify-center backdrop-blur-sm shadow-xl" style={{ backgroundColor: `${themePrimary}44`, color: themePrimary }}>
                        <ImageIcon size={32} />
                      </div>
                    )}
                  </div>
                  <h1 className="text-2xl font-black italic tracking-tighter uppercase drop-shadow-lg text-white">{name || "Sua Empresa"}</h1>
                  <p className="text-white/70 text-xs mt-1 drop-shadow-md">Como foi sua experiência conosco?</p>
                </div>

                <div 
                  className={`bg-[#121214]/80 backdrop-blur-xl border border-white/10 p-6 shadow-2xl w-full ${themeRadius}`}
                >
                  <div className="flex flex-col items-center gap-4 mb-6">
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Sua Nota</span>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={32}
                          color={star <= 4 ? themePrimary : "rgba(255,255,255,0.1)"}
                          fill={star <= 4 ? themePrimary : "none"}
                          strokeWidth={star <= 4 ? 0 : 2}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <input
                      disabled
                      placeholder="Ex: Rafael Castro"
                      className={`w-full bg-black/40 border border-white/5 px-4 py-3 text-sm text-zinc-400 opacity-50 ${themeRadius}`}
                    />
                    <textarea
                      disabled
                      className={`w-full bg-black/40 border border-white/5 px-4 py-3 text-sm h-24 resize-none text-zinc-400 opacity-50 ${themeRadius}`}
                      placeholder="Conte-nos o que achou..."
                    />
                  </div>

                  <button
                    disabled
                    className={`w-full mt-6 h-12 text-sm font-black uppercase tracking-widest transition-all shadow-lg ${themeRadius}`}
                    style={{ backgroundColor: themePrimary, color: "#fff" }}
                  >
                    Enviar Feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Dica */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-zinc-500 text-sm whitespace-nowrap flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            Preview em tempo real
          </div>
        </div>

      </div>
    </div>
  );
}
