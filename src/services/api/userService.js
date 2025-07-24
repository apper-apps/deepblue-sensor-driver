import userData from "@/services/mockData/users.json";

class UserServiceClass {
  constructor() {
    this.users = [...userData];
  }

  async getAll() {
    await this.delay();
    return this.users.map(user => {
      const { password, ...publicUser } = user;
      return publicUser;
    });
  }

  async getById(id) {
    await this.delay();
    const user = this.users.find(u => u.Id === id);
    if (!user) {
      throw new Error("User not found");
    }
    
    const { password, ...publicUser } = user;
    return publicUser;
  }

  async getInstructors() {
    await this.delay();
    return this.users
      .filter(user => user.role === 'instructor' || user.role === 'admin')
      .map(user => {
        const { password, ...publicUser } = user;
        return publicUser;
      });
  }

  async updateProfile(id, profileData) {
    await this.delay();
    const index = this.users.findIndex(u => u.Id === id);
    if (index === -1) {
      throw new Error("User not found");
    }

    // Don't allow updating sensitive fields through profile update
    const { Id, email, password, role, isActive, createdAt, ...allowedData } = profileData;
    
    this.users[index] = {
      ...this.users[index],
      ...allowedData,
      profileComplete: this.isProfileComplete({ ...this.users[index], ...allowedData })
    };

    const { password: pwd, ...publicUser } = this.users[index];
    return publicUser;
  }

  async updateRole(id, newRole) {
    await this.delay();
    const index = this.users.findIndex(u => u.Id === id);
    if (index === -1) {
      throw new Error("User not found");
    }

    this.users[index].role = newRole;
    const { password, ...publicUser } = this.users[index];
    return publicUser;
  }

  async toggleActiveStatus(id) {
    await this.delay();
    const index = this.users.findIndex(u => u.Id === id);
    if (index === -1) {
      throw new Error("User not found");
    }

    this.users[index].isActive = !this.users[index].isActive;
    const { password, ...publicUser } = this.users[index];
    return publicUser;
  }

  async delete(id) {
    await this.delay();
    const index = this.users.findIndex(u => u.Id === id);
    if (index === -1) {
      throw new Error("User not found");
    }
    
    this.users.splice(index, 1);
    return true;
  }

  async uploadProfileImage(id, imageFile) {
    await this.delay();
    // Simulate image upload - in real app would upload to cloud storage
    const imageUrl = `/uploads/profiles/${id}_${Date.now()}.jpg`;
    
    const index = this.users.findIndex(u => u.Id === id);
    if (index === -1) {
      throw new Error("User not found");
    }

    this.users[index].profileImage = imageUrl;
    return imageUrl;
  }

  async addCertification(id, certification) {
    await this.delay();
    const index = this.users.findIndex(u => u.Id === id);
    if (index === -1) {
      throw new Error("User not found");
    }

    const newCertification = {
      Id: Date.now(), // Simple ID for demo
      ...certification,
      addedAt: new Date().toISOString()
    };

    this.users[index].certifications.push(newCertification);
    return newCertification;
  }

  async removeCertification(id, certificationId) {
    await this.delay();
    const index = this.users.findIndex(u => u.Id === id);
    if (index === -1) {
      throw new Error("User not found");
    }

    this.users[index].certifications = this.users[index].certifications.filter(
      cert => cert.Id !== certificationId
    );
    return true;
  }

  isProfileComplete(user) {
    return !!(
      user.firstName &&
      user.lastName &&
      user.bio &&
      user.location &&
      user.emergencyContact?.name &&
      user.emergencyContact?.phone
    );
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 250));
  }
}

export const UserService = new UserServiceClass();