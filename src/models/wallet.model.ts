import mongoose from "mongoose";

interface IWallet {
  user: mongoose.Types.ObjectId;
  wallet_req_ref: string;
  token: {
    one: string;
    two: string;
  }
  account_no? : string;
  activated: boolean;
}

const walletSchema = new mongoose.Schema<IWallet>(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    wallet_req_ref: {
        type: String,
        require: true
    },
    token: {
      one: {
        type: String,
        require: true,
      },
      two: {
        type: String,
        require: true,
      },
    },
    account_no: {
      type: String,
      require: false,
    },
    activated: {
        type: Boolean,
        require: true,
        default: false
    }
  },
  { timestamps: true }
);

export const Wallet = mongoose.model<IWallet>("Wallet", walletSchema);
