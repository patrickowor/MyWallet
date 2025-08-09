import { Env } from "@config/env.config";
import crypto from "crypto";
import axios from "axios";
import { validate } from "class-validator";
import { error } from "console";

type OnePipeCreateWalletPayload = {
  request_ref: string;
  request_type: "open_account";
  auth: {
    type: null;
    secure: null;
    auth_provider: "DemoProvider";
    route_mode: null;
  };
  transaction: {
    mock_mode: "inspect";
    transaction_ref: string;
    transaction_desc: string;
    transaction_ref_parent: null;
    amount: 0;
    customer: {
      customer_ref: string; // customer Id
      firstname: string;
      surname: string;
      email: string;
      mobile_no: string; // phone number no +
    };
    meta: {
      a_key: string;
      another_key: string;
    };
    details: {
      name_on_account: string;
      middlename: string;
      dob: Date;
      gender: "M" | "F";
      title: "Mr" | "Mrs" | "Miss" | "Dr";
      address_line_1: string;
      address_line_2: string;
      city: string;
      state: string;
      country: "NG";
    };
  };
};

type OnePipeCreateWalletRequest = {
  user_id: string; // user Id
  transaction_ref: string;
  firstname: string;
  surname: string;
  email: string;
  mobile_no: string; // phone number no +
  date_of_birth: Date;
  gender: "M" | "F";
  title: "Mr" | "Mrs" | "Miss" | "Dr";
  address: string;
  city: string;
  state: string;
  token1: string; // token for the request
  token2: string; // token for the request
};

type OnePipeValidateTransact = {
  request_ref: string;
  request_type: string; //"{{request_type}}"
  auth: {
    secure: string;
    auth_provider: string; //"{{provider}}"
  };
  transaction: {
    transaction_ref: string;
  };
};


type OnePipeQueryTransactTransaction = {
  transaction_ref: string;
};

type OnePipeQueryTransact = {
  request_ref: string;
  request_type: "get_statement";
  transaction: OnePipeQueryTransactTransaction;
};

export interface OnePipeInterface {
  createWallet(payload: OnePipeCreateWalletRequest): Promise<any>;
  validateotp(otp: string, transaction_ref: string): Promise<any>;
  queryAccountCreation(payload: OnePipeQueryTransactTransaction): Promise<any>;
  getWalletInfo(account_id: string): Promise<any>;
  generateRequestRef() : string;
}

export class OnePipeLive implements OnePipeInterface {
  private ONE_PIPE_URL: string = Env.ONE_PIPE_URL;
  private ONE_PIPE_API_KEY: string = Env.ONE_PIPE_API_KEY;
  private ONE_PIPE_SECRET_KEY: string = Env.ONE_PIPE_SECRET_KEY;

  private endpoints = {
    createWallet: `${this.ONE_PIPE_URL}/transact`,
    validate: `${this.ONE_PIPE_URL}/transact/validate`,
    statusQuery: `${this.ONE_PIPE_URL}/transact/query`,
    walletInfo: `${this.ONE_PIPE_URL}/wallets/info`,
  };

  public generateRequestRef() {
    return crypto.randomBytes(20).toString("hex");
  }

  private getAuth(request_ref: string) {
    // header Signature:MD5Hash(request_ref;client_secret)
    const signature = crypto
      .createHash("md5")
      .update(`${request_ref};${this.ONE_PIPE_SECRET_KEY}`)
      .digest("hex");

    return {
      authorization: `Bearer ${this.ONE_PIPE_API_KEY}`,
      signature: signature,
      "Content-Type": "application/json",
    };
  }

  public async createWallet(payload: OnePipeCreateWalletRequest): Promise<any> {
    const request_ref = this.generateRequestRef();
    const transaction_ref = this.generateRequestRef();

    const payloadData: OnePipeCreateWalletPayload = {
      request_ref: request_ref,
      request_type: "open_account",
      auth: {
        type: null,
        secure: null,
        auth_provider: "DemoProvider",
        route_mode: null,
      },
      transaction: {
        mock_mode: "inspect",
        transaction_ref: transaction_ref,
        transaction_desc: "Create Wallet for user " + payload.user_id,
        transaction_ref_parent: null,
        amount: 0,
        customer: {
          customer_ref: payload.user_id,
          firstname: payload.firstname,
          surname: payload.surname,
          email: payload.email,
          mobile_no: payload.mobile_no.replace("+", ""),
        },
        meta: {
          a_key: payload.token1,
          another_key: payload.token2,
        },
        details: {
          name_on_account: payload.firstname + " " + payload.surname,
          middlename: "",
          dob: payload.date_of_birth,
          gender: payload.gender,
          title: payload.title,
          address_line_1: payload.address,
          address_line_2: "",
          city: payload.city,
          state: payload.state,
          country: "NG",
        },
      },
    };
    const headers = this.getAuth(request_ref);

    const res = await axios.post(this.endpoints.createWallet, payloadData, {
      headers,
    });

    return res.data;
  }

  public async validateotp(otp: string, transaction_ref: string): Promise<any> {
    const request_ref = this.generateRequestRef();
    const headers = this.getAuth(request_ref);

    const payload: OnePipeValidateTransact = {
      request_ref: request_ref,
      request_type: "validate_otp",
      auth: {
        secure: otp,
        auth_provider: "DemoProvider",
      },
      transaction: {
        transaction_ref: transaction_ref,
      },
    };

    const res = await axios.post(this.endpoints.validate, payload, {
      headers,
    });

    return res.data;
  }

  public async queryAccountCreation(
    payload: OnePipeQueryTransactTransaction
  ): Promise<any> {
    const request_ref = this.generateRequestRef();
    const headers = this.getAuth(request_ref);

    const queryPayload: OnePipeQueryTransact = {
      request_ref: request_ref,
      request_type: "get_statement",
      transaction: payload,
    };

    const res = await axios.post(this.endpoints.statusQuery, payload, {
      headers,
    });

    return res.data;
  }

  public async getWalletInfo(account_id: string): Promise<any> {

  }
}

export class OnePipeMockUp implements OnePipeInterface {
  public generateRequestRef() {
    return crypto.randomBytes(20).toString("hex");
  }

  public async createWallet(
    payload: OnePipeCreateWalletRequest
  ): Promise<Record<string, any>> {
    return {
      status: "WaitingForOTP",
      message:
        `please enter the OTP sent to ${payload.mobile_no}, use 12345678 as your OTP`,
      data: {
        provider_response_code: "900T0",
        provider: "DemoProvider",
        errors: null,
        error: null,
        provider_response: null,
        client_info: {
          name: payload.firstname + " " + payload.surname,
          id: null,
          bank_cbn_code: null,
          bank_name: null,
          console_url: null,
          js_background_image: null,
          css_url: null,
          logo_url: null,
          footer_text: null,
          show_options_icon: false,
          paginate: false,
          paginate_count: 0,
          options: null,
          merchant: null,
          colors: null,
          meta: null,
        },
      },
    };
  }

  public async validateotp(otp: string, transaction_ref: string): Promise<any> {
    const charge_token = this.generateRequestRef();
    return {
      status: "Success",
      message: "Wallet created successfully",
      data: {
        provider_response_code: "00",
        provider: "DemoProvider",
        errors: [],
        error: null,
        // error: {
        //   code: "99",
        //   message: "Mocked error for testing",
        // }
        charge_token: charge_token,
        paymentoptions: ["cards", "bank_transfer"],
      },
    };
  }

  public async queryAccountCreation(
    payload: OnePipeQueryTransactTransaction
  ): Promise<Record<string, any>> {
    return {
      status: "Successful",
      message: "Transaction processed successfully",
      data: {
        auth_token: null,
        provider_auth_token: null,
        provider_response_code: null,
        provider: null,
        errors: null,
        error: null,
        provider_response: {
          provider_auth_token: null,
          paymentoptions: [],
          transaction_final_amount: 1000,
          reference: "8996423353999",
          meta: {
            currency: "NGN",
          },
        },
        client_info: {
          name: null,
          id: null,
          bank_cbn_code: null,
          bank_name: null,
          console_url: null,
          js_background_image: null,
          css_url: null,
          logo_url: null,
          footer_text: null,
          show_options_icon: false,
          paginate: false,
          paginate_count: 0,
          options: null,
          merchant: null,
          colors: null,
          meta: null,
        },
      },
    };
  }


  public async getWalletInfo(account_id: string): Promise<Record<string, any>> {
    return {
      status: "Successful",
      message: "Transaction processed successfully",
      data: {
        provider_response_code: "00",
        provider: "DemoProvider",
        errors: null,
        error: null,
        provider_response: {
          account_id: account_id,
          account_type: "CURRENT",
          account_number: "6200000766",
          available_balance: 2077099,
          ledger_balance: 2077099,
          minimum_balance: 0,
          account_class: "STFCUR",
          account_status: "ACCOUNT OPEN",
          currency: "NGN",
          reference: "9310153185607",
          meta: {
            field_key: "field_value",
          },
        },
        client_info: {
          name: null,
          id: null,
          bank_cbn_code: null,
          bank_name: null,
          console_url: null,
          js_background_image: null,
          css_url: null,
          logo_url: null,
          footer_text: null,
          show_options_icon: false,
          paginate: false,
          paginate_count: 0,
          options: null,
          merchant: null,
          colors: null,
          meta: null,
        },
      },
    };
  }
}
