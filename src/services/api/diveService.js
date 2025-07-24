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
async generateShareableImage(sessionId, diveId) {
    await this.delay();
    
    try {
      const dive = await this.getById(diveId);
      // We'll need session data for the image, but for now we'll simulate getting it
      const session = { location: "Dive Location", date: new Date().toISOString(), photos: [] };
      
      return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 600;

        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, 600);
        gradient.addColorStop(0, '#0ea5e9');
        gradient.addColorStop(0.5, '#0284c7');
        gradient.addColorStop(1, '#0369a1');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);

        // Add overlay for text readability
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, 800, 600);

        // Header text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('DeepBlue Log', 400, 60);

        // Dive statistics
        ctx.font = 'bold 48px Arial';
        let mainValue = '';
        let unit = '';
        let label = '';

        if (dive.depth !== null) {
          mainValue = dive.depth.toString();
          unit = 'm';
          label = 'DEPTH REACHED';
        } else if (dive.distance !== null) {
          mainValue = dive.distance.toString();
          unit = 'm';
          label = 'DISTANCE COVERED';
        } else if (dive.time !== null) {
          const minutes = Math.floor(dive.time / 60);
          const seconds = dive.time % 60;
          mainValue = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          unit = '';
          label = 'TIME HELD';
        }

        // Main statistic
        ctx.fillText(mainValue + unit, 400, 250);
        
        // Label
        ctx.font = '24px Arial';
        ctx.fillText(label, 400, 290);

        // Date and location
        ctx.font = '20px Arial';
        const date = new Date(session.date).toLocaleDateString();
        ctx.fillText(date, 400, 350);
        ctx.fillText(session.location || 'Open Water', 400, 380);

        // Notes if available
        if (dive.notes) {
          ctx.font = '18px Arial';
          ctx.fillText(`"${dive.notes}"`, 400, 450);
        }

        // Footer
        ctx.font = '16px Arial';
        ctx.fillText('Share your freediving achievements', 400, 550);

        // Convert to blob
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          resolve(url);
        }, 'image/png');
      });
    } catch (error) {
      throw new Error('Failed to generate shareable image');
    }
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 200));
  }
}

export const DiveService = new DiveServiceClass();