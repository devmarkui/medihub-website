import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  Stethoscope,
  Search,
  Upload,
  Link as LinkIcon,
  GraduationCap,
  Calendar,
  Languages,
  X,
  Save,
  Loader2,
  ImageOff,
} from "lucide-react";
import { useAdminData, type Doctor } from "@/contexts/AdminDataContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn, doctorPhoto } from "@/lib/utils";
import { toast } from "sonner";

type FormState = Omit<Doctor, "id" | "languages"> & {
  languagesText: string;
};

const emptyForm: FormState = {
  name: "",
  specialty: "",
  photo: "",
  bio: "",
  qualifications: "",
  yearsExperience: 0,
  languagesText: "English",
  email: "",
  phone: "",
  featured: false,
};

// ~1.5 MB cap on base64 photos so localStorage doesn't blow up.
const MAX_PHOTO_BYTES = 1.5 * 1024 * 1024;

export const AdminDoctors = () => {
  const { doctors, addDoctor, updateDoctor, deleteDoctor } = useAdminData();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Doctor | null>(null);

  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (doctor: Doctor) => {
    deleteDoctor(doctor.id);
    setConfirmDelete(null);
    toast.success(`${doctor.name} removed`);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-end gap-4 justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Stethoscope className="w-5 h-5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Clinical Team
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Manage Doctors
          </h1>
          <p className="text-slate-600 mt-1.5 max-w-2xl">
            Add, edit and feature the consultants shown on the public website.
          </p>
        </div>

        <Button
          onClick={() => setCreating(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Doctor
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search by name or specialty…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Doctor cards */}
      {filtered.length === 0 ? (
        <EmptyState onAdd={() => setCreating(true)} hasDoctors={doctors.length > 0} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doctor) => (
            <AdminDoctorCard
              key={doctor.id}
              doctor={doctor}
              onEdit={() => setEditing(doctor)}
              onDelete={() => setConfirmDelete(doctor)}
              onToggleFeatured={() =>
                updateDoctor(doctor.id, { featured: !doctor.featured })
              }
            />
          ))}
        </div>
      )}

      {/* Create dialog */}
      <DoctorFormDialog
        open={creating}
        title="Add a doctor"
        description="Create a new doctor profile. The card will appear on the public Meet our Doctors section as soon as you save."
        initial={emptyForm}
        onClose={() => setCreating(false)}
        onSubmit={(values) => {
          addDoctor(values);
          setCreating(false);
          toast.success(`${values.name} added`);
        }}
      />

      {/* Edit dialog */}
      <DoctorFormDialog
        open={editing !== null}
        title={editing ? `Edit ${editing.name}` : "Edit doctor"}
        description="Updates publish to the website immediately when saved."
        initial={editing ? toFormState(editing) : emptyForm}
        onClose={() => setEditing(null)}
        onSubmit={(values) => {
          if (editing) {
            updateDoctor(editing.id, values);
            toast.success(`${values.name} updated`);
            setEditing(null);
          }
        }}
      />

      {/* Confirm delete */}
      <AlertDialog
        open={confirmDelete !== null}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this doctor?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDelete &&
                `${confirmDelete.name} will be removed from the public website immediately. This can't be undone — you'd need to re-add the profile.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep doctor</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDelete && handleDelete(confirmDelete)}
              className="bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-500"
            >
              Yes, remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// ── Doctor card (admin grid) ───────────────────────────────────────────────
const AdminDoctorCard = ({
  doctor,
  onEdit,
  onDelete,
  onToggleFeatured,
}: {
  doctor: Doctor;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFeatured: () => void;
}) => (
  <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white hover:shadow-md hover:border-slate-300 transition-all">
    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
      <img
        src={doctorPhoto(doctor)}
        alt={doctor.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src =
            `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(doctor.name)}&backgroundColor=42BEAD`;
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900/80 to-transparent" />

      {doctor.featured && (
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-amber-400/95 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-amber-950">
          <Star className="w-3 h-3 fill-amber-950" />
          Featured
        </span>
      )}

      <div className="absolute inset-x-3 bottom-3 text-white">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">
          {doctor.specialty}
        </p>
        <h3 className="font-heading text-base font-extrabold leading-tight drop-shadow-md truncate">
          {doctor.name}
        </h3>
      </div>
    </div>

    <div className="p-4">
      <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
        <span className="inline-flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {doctor.yearsExperience}y
        </span>
        <span>•</span>
        <span className="inline-flex items-center gap-1">
          <Languages className="w-3.5 h-3.5" />
          {doctor.languages.length}
        </span>
        <span>•</span>
        <span className="inline-flex items-center gap-1 truncate">
          <GraduationCap className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{doctor.qualifications.split(",")[0]}</span>
        </span>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
        <Button
          size="sm"
          variant="outline"
          onClick={onEdit}
          className="flex-1"
        >
          <Pencil className="w-3.5 h-3.5 mr-1.5" />
          Edit
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onToggleFeatured}
          className={cn(
            "p-2",
            doctor.featured
              ? "text-amber-600 hover:text-amber-700"
              : "text-slate-400 hover:text-amber-600"
          )}
          title={doctor.featured ? "Unfeature" : "Mark as featured"}
        >
          <Star
            className={cn(
              "w-4 h-4",
              doctor.featured && "fill-amber-500 text-amber-500"
            )}
          />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
          className="p-2 text-slate-400 hover:text-rose-600"
          title="Remove"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
);

// ── Empty state ────────────────────────────────────────────────────────────
const EmptyState = ({
  onAdd,
  hasDoctors,
}: {
  onAdd: () => void;
  hasDoctors: boolean;
}) => (
  <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 sm:p-14 text-center">
    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
      <Stethoscope className="w-7 h-7" />
    </div>
    <h3 className="font-heading text-lg font-extrabold text-slate-900 mb-1.5">
      {hasDoctors ? "No doctors match your search" : "No doctors yet"}
    </h3>
    <p className="text-slate-500 text-sm max-w-md mx-auto mb-5">
      {hasDoctors
        ? "Try a different name or specialty."
        : "Add the first doctor profile to populate the public Meet our Doctors section."}
    </p>
    {!hasDoctors && (
      <Button onClick={onAdd} className="bg-primary hover:bg-primary/90">
        <Plus className="w-4 h-4 mr-1" />
        Add Doctor
      </Button>
    )}
  </div>
);

// ── Form dialog ────────────────────────────────────────────────────────────
const DoctorFormDialog = ({
  open,
  title,
  description,
  initial,
  onClose,
  onSubmit,
}: {
  open: boolean;
  title: string;
  description: string;
  initial: FormState;
  onClose: () => void;
  onSubmit: (values: Omit<Doctor, "id">) => void;
}) => {
  const [form, setForm] = useState<FormState>(initial);
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  // Reset form when reopening with different initial values
  useEffect(() => {
    if (open) setForm(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onFileSelected = (file: File) => {
    if (file.size > MAX_PHOTO_BYTES) {
      toast.error(
        `Photo is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Use under 1.5MB or paste a URL instead.`
      );
      return;
    }
    setBusy(true);
    const reader = new FileReader();
    reader.onload = () => {
      update("photo", reader.result as string);
      setBusy(false);
      toast.success("Photo uploaded");
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
      setBusy(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    // Minimal validation
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.specialty.trim()) return toast.error("Specialty is required");
    if (!form.qualifications.trim()) return toast.error("Qualifications are required");

    const languages = form.languagesText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    onSubmit({
      name: form.name.trim(),
      specialty: form.specialty.trim(),
      photo: form.photo.trim(),
      bio: form.bio.trim(),
      qualifications: form.qualifications.trim(),
      yearsExperience: Number(form.yearsExperience) || 0,
      languages,
      email: form.email?.trim() || undefined,
      phone: form.phone?.trim() || undefined,
      featured: !!form.featured,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-[200px_1fr] gap-6 py-4">
          {/* Photo */}
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-widest font-bold text-slate-500">
              Photo{" "}
              <span className="text-slate-400 font-normal normal-case">
                (optional)
              </span>
            </Label>
            <div className="aspect-square rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative">
              {form.photo ? (
                <img
                  src={form.photo}
                  alt="Preview"
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(e) =>
                    ((e.currentTarget as HTMLImageElement).style.display = "none")
                  }
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                  <ImageOff className="w-8 h-8 mb-2" />
                  <span className="text-xs">No photo</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onFileSelected(f);
                  e.target.value = "";
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busy}
                onClick={() => fileInput.current?.click()}
                className="w-full"
              >
                {busy ? (
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-1.5" />
                )}
                Upload file
              </Button>
              <div className="relative">
                <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <Input
                  value={form.photo.startsWith("data:") ? "" : form.photo}
                  onChange={(e) => update("photo", e.target.value)}
                  placeholder="Or paste image URL"
                  className="pl-8 text-xs h-9"
                />
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Square photos look best. Max 1.5MB if uploading a file.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full name" required>
                <Input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Dr. Jane Doe"
                />
              </Field>
              <Field label="Specialty" required>
                <Input
                  value={form.specialty}
                  onChange={(e) => update("specialty", e.target.value)}
                  placeholder="Family Physician"
                />
              </Field>
            </div>

            <Field label="Qualifications" required>
              <Input
                value={form.qualifications}
                onChange={(e) => update("qualifications", e.target.value)}
                placeholder="MBBS, MD, FRCP"
              />
            </Field>

            <Field
              label="Short bio"
              hint="Up to ~250 characters — kept short on the card."
            >
              <Textarea
                value={form.bio}
                onChange={(e) => update("bio", e.target.value)}
                rows={3}
                maxLength={250}
                placeholder="A short summary of focus areas and experience."
                className="resize-none"
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Years of experience">
                <Input
                  type="number"
                  min={0}
                  max={70}
                  value={form.yearsExperience}
                  onChange={(e) =>
                    update("yearsExperience", Number(e.target.value))
                  }
                />
              </Field>
              <Field
                label="Languages"
                hint="Comma-separated — e.g. English, Sinhala, Tamil"
              >
                <Input
                  value={form.languagesText}
                  onChange={(e) => update("languagesText", e.target.value)}
                  placeholder="English, Sinhala"
                />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Email (optional)">
                <Input
                  type="email"
                  value={form.email ?? ""}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="dr.doe@medihub.lk"
                />
              </Field>
              <Field label="Phone (optional)">
                <Input
                  value={form.phone ?? ""}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+94 77 123 4567"
                />
              </Field>
            </div>

            <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-slate-200 bg-slate-50">
              <div>
                <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Star
                    className={cn(
                      "w-4 h-4",
                      form.featured && "fill-amber-500 text-amber-500"
                    )}
                  />
                  Feature this doctor
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Featured doctor gets the large hero card. Only one is shown
                  prominently — newest featured wins.
                </p>
              </div>
              <Switch
                checked={!!form.featured}
                onCheckedChange={(v) => update("featured", v)}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={onClose}>
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90"
          >
            <Save className="w-4 h-4 mr-1.5" />
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Field = ({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label className="text-xs uppercase tracking-widest font-bold text-slate-500">
      {label} {required && <span className="text-rose-500 normal-case">*</span>}
    </Label>
    {children}
    {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
  </div>
);

const toFormState = (d: Doctor): FormState => ({
  name: d.name,
  specialty: d.specialty,
  photo: d.photo,
  bio: d.bio,
  qualifications: d.qualifications,
  yearsExperience: d.yearsExperience,
  languagesText: d.languages.join(", "),
  email: d.email ?? "",
  phone: d.phone ?? "",
  featured: d.featured,
});

export default AdminDoctors;
