// AI Service for Marketplace Listing Generation
export interface AIGenerationRequest {
  itemName: string;
  category: 'equipment' | 'livestock' | 'product';
  condition: 'new' | 'used' | 'reconditioned';
  price: number;
  quantity?: number;
  location: string;
  brandBreedVariety?: string;
  conditionSummary?: string;
  specifications?: Record<string, any>;
}

export interface AIGenerationResponse {
  title: string;
  description: string;
  tags: string[];
  seoTitle?: string;
  keyFeatures?: string[];
  benefits?: string[];
}

export class MarketplaceAIService {
  private static instance: MarketplaceAIService;
  
  public static getInstance(): MarketplaceAIService {
    if (!MarketplaceAIService.instance) {
      MarketplaceAIService.instance = new MarketplaceAIService();
    }
    return MarketplaceAIService.instance;
  }

  async generateListing(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    try {
      // For now, we'll use a template-based approach
      // In production, this would call an actual AI API like OpenAI, Claude, etc.
      
      const categoryTemplates = {
        equipment: {
          headline: `High-performance ${request.condition} ${request.itemName} in excellent working condition`,
          features: [
            'Strong engine performance',
            'Durable construction',
            'Easy maintenance',
            'Fuel efficient'
          ],
          benefits: [
            'Increases farm productivity',
            'Reduces manual labor',
            'Cost-effective operation',
            'Reliable performance'
          ]
        },
        livestock: {
          headline: `Healthy ${request.condition} ${request.itemName} perfect for breeding and dairy`,
          features: [
            'Excellent health condition',
            'Good breeding potential',
            'Proper vaccination',
            'Well-maintained'
          ],
          benefits: [
            'High milk yield potential',
            'Strong breeding genetics',
            'Disease resistant',
            'Long-term investment'
          ]
        },
        product: {
          headline: `Premium quality ${request.condition} ${request.itemName} fresh from harvest`,
          features: [
            'Premium grade quality',
            'Fresh harvest',
            'Proper storage',
            'Organic certified'
          ],
          benefits: [
            'Superior taste and nutrition',
            'Health benefits',
            'Market premium pricing',
            'Consumer preference'
          ]
        }
      };

      const template = categoryTemplates[request.category];
      const location = request.location.split(',')[0];
      
      const title = `${request.condition.charAt(0).toUpperCase() + request.condition.slice(1)} ${request.itemName} - Ready for Your Farm`;
      
      const description = `${template.headline}.
${template.features.slice(0, 2).join(', ')} make this ${request.category} ideal for ${this.getCategoryUseCase(request.category)}.
With ${request.condition === 'new' ? 'brand new condition' : 'proven reliability'}, it offers ${template.benefits.slice(0, 2).join(' and ')}.
Located in ${request.location}, ready for immediate ${request.category === 'equipment' ? 'delivery' : 'pickup'}. Contact now to secure this ${this.getCategoryValue(request.category)}!`;

      const tags = this.generateTags(request);

      return {
        title,
        description,
        tags,
        seoTitle: `${request.itemName} ${request.condition} sale ${location}`,
        keyFeatures: template.features,
        benefits: template.benefits
      };

    } catch (error) {
      console.error('AI generation error:', error);
      throw new Error('Failed to generate AI description');
    }
  }

  private getCategoryUseCase(category: string): string {
    switch (category) {
      case 'equipment': return 'modern farming operations';
      case 'livestock': return 'dairy or breeding purposes';
      case 'product': return 'fresh consumption or processing';
      default: return 'agricultural needs';
    }
  }

  private getCategoryValue(category: string): string {
    switch (category) {
      case 'equipment': return 'essential farming equipment';
      case 'livestock': return 'valuable livestock';
      case 'product': return 'quality produce';
      default: return 'agricultural item';
    }
  }

  private generateTags(request: AIGenerationRequest): string[] {
    const tags = [
      request.category,
      request.condition,
      request.itemName.toLowerCase().split(' ')[0],
      request.location.split(',')[0].toLowerCase(),
      'farm-market'
    ];

    // Add category-specific tags
    if (request.category === 'equipment') {
      tags.push('farming-tools', 'agricultural-machinery');
    } else if (request.category === 'livestock') {
      tags.push('dairy-cattle', 'breeding-stock');
    } else if (request.category === 'product') {
      tags.push('fresh-produce', 'organic-farming');
    }

    // Add brand/variety tags if available
    if (request.brandBreedVariety) {
      tags.push(request.brandBreedVariety.toLowerCase().replace(/\s+/g, '-'));
    }

    return tags.filter((tag, index) => tags.indexOf(tag) === index); // Remove duplicates
  }

  async generateSEOKeywords(request: AIGenerationRequest): Promise<string[]> {
    const keywords = [];
    
    // Basic keywords
    keywords.push(request.itemName.toLowerCase());
    keywords.push(`${request.condition} ${request.category}`);
    
    // Location-based keywords
    const locationParts = request.location.split(',').map(part => part.trim().toLowerCase());
    locationParts.forEach(part => {
      keywords.push(`${part} ${request.category}`);
      keywords.push(`${part} farm market`);
    });
    
    // Category-specific keywords
    if (request.category === 'equipment') {
      keywords.push('farm equipment sale', 'agricultural machinery', 'tractor sale');
    } else if (request.category === 'livestock') {
      keywords.push('cattle sale', 'dairy cows', 'livestock market');
    } else if (request.category === 'product') {
      keywords.push('fresh produce', 'organic vegetables', 'farm fresh');
    }
    
    // Brand/variety keywords
    if (request.brandBreedVariety) {
      keywords.push(`${request.brandBreedVariety.toLowerCase()} ${request.category}`);
    }
    
    return [...new Set(keywords)]; // Remove duplicates
  }

  async validateListing(listing: any): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    if (!listing.name || listing.name.length < 5) {
      errors.push('Item name must be at least 5 characters long');
    }
    
    if (!listing.description || listing.description.length < 50) {
      errors.push('Description must be at least 50 characters long');
    }
    
    if (!listing.price || listing.price <= 0) {
      errors.push('Price must be greater than 0');
    }
    
    if (!listing.location || listing.location.length < 5) {
      errors.push('Location must be specified');
    }
    
    if (!listing.images || listing.images.length === 0) {
      errors.push('At least one image is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const marketplaceAI = MarketplaceAIService.getInstance();
