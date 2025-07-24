import divesData from "@/services/mockData/dives.json";

class DiveServiceClass {
  constructor() {
    this.dives = [...divesData];
  }

  async getAll() {
    await this.delay();
    return [...this.dives];
  }

  async getById(id) {
    await this.delay();
    const dive = this.dives.find(d => d.Id === id);
    if (!dive) {
      throw new Error("Dive not found");
    }
    return { ...dive };
  }

  async getBySessionId(sessionId) {
    await this.delay();
    return this.dives
      .filter(dive => dive.sessionId === sessionId)
      .map(dive => ({ ...dive }));
  }

  async create(diveData) {
    await this.delay();
    const newDive = {
      Id: Math.max(...this.dives.map(d => d.Id)) + 1,
      ...diveData
    };
    this.dives.push(newDive);
    return { ...newDive };
  }

  async update(id, diveData) {
    await this.delay();
    const index = this.dives.findIndex(d => d.Id === id);
    if (index === -1) {
      throw new Error("Dive not found");
    }
    this.dives[index] = { ...this.dives[index], ...diveData };
    return { ...this.dives[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.dives.findIndex(d => d.Id === id);
    if (index === -1) {
      throw new Error("Dive not found");
    }
    this.dives.splice(index, 1);
    return true;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 200));
  }
}

export const DiveService = new DiveServiceClass();