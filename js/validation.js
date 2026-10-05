const required = (value, label) => String(value ?? "").trim() ? "" : `${label} é obrigatório.`;
const positive = (value, label, allowZero = false) => {
  const amount = Number(value);
  return Number.isFinite(amount) && (allowZero ? amount >= 0 : amount > 0) ? "" : `${label} deve ser ${allowZero ? "zero ou maior" : "maior que zero"}.`;
};

export function validateVehicle(data) {
  const yearError = data.year === "" || data.year == null ? "" : positive(data.year, "Ano", true);
  return required(data.name, "Nome do veículo") || required(data.type, "Tipo") || required(data.fuel, "Combustível") || yearError || positive(data.currentOdometer, "Quilometragem", true);
}

export function validatePaymentMethod(data, editing = false) {
  if (!String(data.name || "").trim()) return "Informe um nome para o cart\u00e3o.";
  if (!String(data.institution || "").trim()) return "Informe a institui\u00e7\u00e3o financeira.";
  const digits = String(data.cardNumber || "").replace(/\D/g, "");
  if (!digits && !editing) return "Informe o numero do cartao.";
  if (digits && (digits.length < 13 || digits.length > 19)) return "O n\u00famero do cart\u00e3o deve ter entre 13 e 19 d\u00edgitos.";
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(String(data.expiry || ""))) return "Informe a validade do cart\u00e3o.";
  return "";
}

export function validateRecord(kind, data) {
  const dateError = required(data.date || data.startDate, "Data");
  if (dateError) return dateError;
  if (kind === "refuels") {
    return positive(data.odometer, "Quilometragem", true) || positive(data.liters, "Litros") || positive(data.pricePerLiter, "Preço por litro") || (Number(data.total) <= 0 ? "O valor total deve ser maior que zero." : "");
  }
  if (kind === "maintenances" || kind === "tires" || kind === "expenses") {
    return required(data.service || data.description || data.category || data.action, "Descrição") || positive(data.amount, "Valor", true) || (data.odometer !== "" && data.odometer != null ? positive(data.odometer, "Quilometragem", true) : "");
  }
  if (kind === "trips") {
    if (Number(data.endOdometer) < Number(data.startOdometer)) return "A quilometragem final não pode ser menor que a inicial.";
    return required(data.origin, "Origem") || required(data.destination, "Destino") || positive(data.startOdometer, "Quilometragem inicial", true) || positive(data.endOdometer, "Quilometragem final", true);
  }
  return "";
}

export function validateShare(email, role) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Informe um e-mail válido.";
  if (!["editor", "viewer"].includes(role)) return "Escolha uma permissão válida.";
  return "";
}
