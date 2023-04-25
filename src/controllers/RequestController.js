class RequestController {

    static hostEndpoint = `${process.env.REACT_APP_HOST_ENDPOINT}`;
    static odooApiKey = `${process.env.REACT_APP_ODOO_API_KEY}`;

    static async getUserInformation(body){
        return fetch(`${this.hostEndpoint}/api/pdpa/get_user_information`, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${this.odooApiKey}`, 
            }, 
            body: JSON.stringify(body), 
        });
    }

    static async getChecklistLine(body){
        return fetch(`${this.hostEndpoint}/api/pdpa/get_checklist_info`, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${this.odooApiKey}`, 
            }, 
            body: JSON.stringify(body), 
        });
    };

    static async getStatusMapping(body){
        return fetch(`${this.hostEndpoint}/api/pdpa/get_checklist_line_status_mapping`, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${this.odooApiKey}`, 
            }, 
            body: JSON.stringify(body), 
        });
    };

    static async getRiskLevelMapping(body){
        return fetch(`${this.hostEndpoint}/api/pdpa/get_risk_level_mapping`, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${this.odooApiKey}`, 
            }, 
            body: JSON.stringify(body), 
        });
    };

    static async createChecklistLine(body){
        return fetch(`${this.hostEndpoint}/api/pdpa/checklist_line/create`, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${this.odooApiKey}`, 
            }, 
            body: JSON.stringify(body), 
        });
    };

    static async updateChecklistLine(body){
        return fetch(`${this.hostEndpoint}/api/pdpa/checklist_line/update`, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${this.odooApiKey}`, 
            }, 
            body: JSON.stringify(body), 
        });
    };

    static async deleteChecklistLine(body){
        return fetch(`${this.hostEndpoint}/api/pdpa/checklist_line/delete`, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${this.odooApiKey}`, 
            }, 
            body: JSON.stringify(body), 
        });
    }

    static async getChecklistDatas(body){
        return fetch(`${this.hostEndpoint}/api/pdpa/checklist`, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${this.odooApiKey}`, 
            }, 
            body: JSON.stringify(body), 
        });
    }

    static async createChecklist(body){
        return fetch(`${this.hostEndpoint}/api/pdpa/checklist/create`, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${this.odooApiKey}`, 
            }, 
            body: JSON.stringify(body), 
        });
    }

    static async deleteChecklist(body){
        return fetch(`${this.hostEndpoint}/api/pdpa/checklist/delete`,  {
            method: "POST", 
            headers: {
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${this.odooApiKey}`, 
            }, 
            body: JSON.stringify(body), 
        });
    }

    static async getPages(body){
        return fetch(`${this.hostEndpoint}/api/pdpa/page`, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${this.odooApiKey}`, 
            }, 
            body: JSON.stringify(body), 
        });
    }

    static async getUsersMapping(body){
        return fetch(`${this.hostEndpoint}/api/pdpa/list_user`, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${this.odooApiKey}`, 
            }, 
            body: JSON.stringify(body), 
        });
    }
};

export default RequestController;