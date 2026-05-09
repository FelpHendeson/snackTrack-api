import { Schema, model, models } from "mongoose";
import { ICashRegisterOutput } from "../interfaces/ICashRegister.interface";

const cashRegisterSchema = new Schema(
  {
    workspaceId: { 
        type: Schema.Types.ObjectId, 
        ref: "Workspace", 
        required: true 
    },
    openingDate: { 
        type: Date, 
        required: true 
    },
    description: { 
        type: String 
    },
    initialValue: { 
        type: Number,
        min: [0, "Valor inicial não pode ser negativo"],
        default: 0
    },
    finalValue: { 
        type: Number,
        min: [0, "Valor final não pode ser negativo"],
        default: 0
    },
    balance: { 
        type: Number, 
        required: true,
        min: [0, "Saldo não pode ser negativo"],
        default: 0
    },
    status: { 
        type: String,
        enum: ["open", "closed"],
        default: "open"
    },
    movements: [{ 
        type: Schema.Types.ObjectId, 
        ref: "Movement" 
    }],
    refills: [{ 
        type: Schema.Types.ObjectId, 
        ref: "CashRefill" 
    }],
    createdBy: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    updatedBy: { 
        type: Schema.Types.ObjectId, 
        ref: "User" 
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Adicionar índices para melhor performance
cashRegisterSchema.index({ workspaceId: 1, status: 1 });
cashRegisterSchema.index({ openingDate: 1 });
cashRegisterSchema.index({ createdBy: 1 });

const CashRegisterModel = models.CashRegister || model<ICashRegisterOutput>("CashRegister", cashRegisterSchema);
export default CashRegisterModel;
