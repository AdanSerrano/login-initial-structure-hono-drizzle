'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertTriangle,
  Copy,
  Download,
  Check,
  RefreshCw,
  Key,
  Shield,
  FileText,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  codes: string[];
  isGenerating?: boolean;
  onRegenerate?: () => void;
}

export function BackupCodesDialog({
  open,
  onOpenChange,
  codes,
  isGenerating = false,
  onRegenerate,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleCopy = async () => {
    const codesText = codes.join('\n');
    await navigator.clipboard.writeText(codesText);
    setCopied(true);
    toast.success('Códigos copiados al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const codesText = `Códigos de respaldo para 2FA
============================
Fecha de generación: ${new Date().toLocaleString('es-ES')}

Guarda estos códigos en un lugar seguro.
Cada código solo puede usarse una vez.

${codes.map((code, i) => `${i + 1}. ${code}`).join('\n')}

============================
IMPORTANTE: No compartas estos códigos con nadie.
`;

    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes-2fa.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    toast.success('Códigos descargados');
  };

  const handleClose = () => {
    onOpenChange(false);
    setDownloaded(false);
    setCopied(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 border border-violet-200/50">
              <Key className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">Códigos de respaldo</DialogTitle>
              <DialogDescription className="mt-1">
                Usa estos códigos si pierdes acceso a tu autenticador
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <Alert className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertTitle className="text-amber-800">Importante</AlertTitle>
            <AlertDescription className="text-amber-700">
              Guarda estos códigos ahora. No podrás verlos de nuevo. Cada código solo puede usarse una vez.
            </AlertDescription>
          </Alert>

          <TooltipProvider>
            <div className="grid grid-cols-2 gap-3 p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border border-border/50">
              {codes.map((code, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "group relative p-3 bg-background rounded-lg border-2 border-border/50",
                        "font-mono text-sm text-center tracking-wider",
                        "hover:border-violet-300 hover:bg-violet-50/50 transition-all cursor-pointer",
                        "select-all"
                      )}
                      onClick={() => {
                        navigator.clipboard.writeText(code);
                        toast.success(`Código ${index + 1} copiado`);
                      }}
                    >
                      <span className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-violet-100 text-violet-600 text-xs flex items-center justify-center font-semibold">
                        {index + 1}
                      </span>
                      <span className="font-semibold">{code}</span>
                      <Copy className="absolute top-1/2 right-2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Clic para copiar</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={handleCopy}
              className={cn(
                "flex-1 gap-2 transition-all",
                copied && "border-emerald-300 bg-emerald-50 text-emerald-700"
              )}
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copiar todos
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleDownload}
              className={cn(
                "flex-1 gap-2 transition-all",
                downloaded && "border-emerald-300 bg-emerald-50 text-emerald-700"
              )}
            >
              {downloaded ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Descargado
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Descargar .txt
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-violet-50/50 border border-violet-100">
            <Shield className="h-5 w-5 text-violet-500 shrink-0" />
            <p className="text-xs text-violet-700">
              Guarda estos códigos en un gestor de contraseñas o en un lugar seguro fuera de línea.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3">
          {onRegenerate && (
            <Button
              variant="ghost"
              onClick={onRegenerate}
              disabled={isGenerating}
              className="w-full sm:w-auto gap-2 text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className={cn("h-4 w-4", isGenerating && "animate-spin")} />
              Regenerar
            </Button>
          )}
          <Button
            onClick={handleClose}
            className="w-full sm:w-auto gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
          >
            <FileText className="h-4 w-4" />
            He guardado mis códigos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
