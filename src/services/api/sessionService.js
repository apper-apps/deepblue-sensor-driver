import sessionsData from "@/services/mockData/sessions.json";

class SessionServiceClass {
  constructor() {
    this.sessions = [...sessionsData];
  }

  async getAll() {
    await this.delay();
    return [...this.sessions];
  }

  async getById(id) {
    await this.delay();
    const session = this.sessions.find(s => s.Id === id);
    if (!session) {
      throw new Error("Session not found");
    }
    return { ...session };
  }

async create(sessionData) {
    await this.delay();
    const newSession = {
      Id: Math.max(...this.sessions.map(s => s.Id)) + 1,
      photos: [],
      ...sessionData
    };
    this.sessions.push(newSession);
    return { ...newSession };
  }

  async update(id, sessionData) {
    await this.delay();
    const index = this.sessions.findIndex(s => s.Id === id);
    if (index === -1) {
      throw new Error("Session not found");
    }
    this.sessions[index] = { ...this.sessions[index], ...sessionData };
    return { ...this.sessions[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.sessions.findIndex(s => s.Id === id);
    if (index === -1) {
      throw new Error("Session not found");
    }
    this.sessions.splice(index, 1);
    return true;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const SessionService = new SessionServiceClass();