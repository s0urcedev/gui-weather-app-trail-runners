export type ConditionTag =
  | "heavy-rain"
  | "high-wind"
  | "extreme-heat"
  | "extreme-cold"
  | "mud"
  | "ice-snow";

export interface EquipmentItem {
  id: string;
  label: string;
  description: string;
  tags: ConditionTag[];
  priority: "must-have" | "nice-to-have";
}

export const EQUIPMENT_CATALOG: EquipmentItem[] = [
    
  //Rain 
  { id: "waterproof-jacket",         
    label: "Waterproof jacket",                   
    description: "Lightweight, taped-seam shell to keep out heavy rain.",                       
    tags: ["heavy-rain", "mud"],                    
     priority: "must-have"    
    },
  { id: "waterproof-trousers",       
    label: "Waterproof trousers",                 
    description: "Overtrousers to keep legs dry during sustained rain.",                        
    tags: ["heavy-rain"],                            
    priority: "nice-to-have" 
    },
  { id: "waterproof-trail-shoes",    
    label: "Waterproof trail shoes",              
    description: "Waterproof lining and deep lugs for grip on wet/muddy terrain.",              
    tags: ["heavy-rain", "mud", "ice-snow"],         
    priority: "must-have"    
    },
  { id: "gaiters",                   
    label: "Gaiters",                             
    description: "Stops water, mud and debris from entering shoes.",                            
    tags: ["heavy-rain", "mud", "ice-snow"],         
    priority: "nice-to-have" 
    },
  { id: "waterproof-socks",          
    label: "Waterproof socks",                    
    description: "Breathable synthetic/wool socks to keep feet dry and warm.",                  
    tags: ["heavy-rain", "mud", "extreme-cold"],     
    priority: "nice-to-have" 
    },
  { id: "brim-cap",                  
    label: "Brim cap / visor",                    
    description: "Keeps rain out of eyes for better visual clarity.",                           
    tags: ["heavy-rain"],                            
    priority: "nice-to-have" 
    },
  { id: "anti-chafe",                
    label: "Anti-chafe cream / blister plasters", 
    description: "Prevents water-activated skin friction.",                                     
    tags: ["heavy-rain", "ice-snow"],                
    priority: "nice-to-have" 
    },
  { id: "dry-bags",                  
    label: "Dry bags",                            
    description: "Lightweight bags to keep electronics and spare kit dry.",                     
    tags: ["heavy-rain"],                            
    priority: "nice-to-have" 
    },

  //Wind 
  { id: "windbreaker-jacket",        
    label: "Windbreaker jacket",                  
    description: "Prevents wind from reaching skin, reduces wind chill.",                       
    tags: ["high-wind"],                             
    priority: "must-have"    
},
  { id: "waterproof-shell",          
    label: "Waterproof shell",                    
    description: "Hooded, taped seams, high collar — combined wind and rain protection.",        
    tags: ["high-wind", "heavy-rain"],               
    priority: "must-have"    
    },
  { id: "wind-resistant-pants",      
    label: "Wind-resistant pants",                
    description: "Compression tights or wind-resistant bottoms.",                               
    tags: ["high-wind"],                             
    priority: "nice-to-have" 
    },
  { id: "neck-gaiter",               
    label: "Neck gaiter / buff",                  
    description: "Protects neck and face from cold wind; can cover nose and mouth.",            
    tags: ["high-wind", "extreme-cold"],             
    priority: "nice-to-have" 
    },
  { id: "thermal-gloves",            
    label: "Thermal gloves",                      
    description: "Retains hand warmth and circulation in cold winds.",                          
    tags: ["high-wind", "extreme-cold", "ice-snow"], 
    priority: "must-have"    
    },
  { id: "running-cap-beanie",        
    label: "Running cap / beanie",                
    description: "Covers ears, keeps head warm; beanie preferred in wind.",                     
    tags: ["high-wind", "extreme-cold"],             
    priority: "nice-to-have" 
    },


  //Heat 
  { id: "light-breathable-apparel",  
    label: "Light, breathable clothing",          
    description: "Light-coloured, sweat-wicking fabrics to reflect and shed heat.",             
    tags: ["extreme-heat"],                          
    priority: "must-have"    
    },
  { id: "sun-hoodie",                
    label: "Sun protection hoodie",               
    description: "Lightweight long-sleeve for UV protection without overheating.",               
    tags: ["extreme-heat"],                          
    priority: "nice-to-have" 
    },
  { id: "trail-shorts",              
    label: "Trail shorts",                        
    description: "Technical lining to prevent chafing in warm conditions.",                     
    tags: ["extreme-heat"],                          
    priority: "must-have"    
    },
  { id: "sunglasses",                
    label: "Sunglasses",                          
    description: "Eye protection from glare and dust.",                                         
    tags: ["extreme-heat"],                          
    priority: "must-have"    
    },
  { id: "sunscreen",                 
    label: "Sunscreen (SPF 30+)",                 
    description: "Water-resistant, high SPF to minimise UV skin damage.",                       
    tags: ["extreme-heat"],                          
    priority: "must-have"    
    },
  { id: "running-vest-heat",         
    label: "Running vest",                        
    description: "Carries 5-10 L of water and gear; essential in heat.",                        
    tags: ["extreme-heat"],                          
    priority: "must-have"    
    },
  { id: "water-filter-electrolytes", 
    label: "Water filter & electrolytes",         
    description: "Refill from streams; replace sodium lost through sweat.",                     
    tags: ["extreme-heat"],                          
    priority: "nice-to-have" 
    },

  //Cold
  { id: "thermal-base-layer",        
    label: "Thermal base layer",                  
    description: "Long-sleeve moisture-wicking wool/synthetic to retain body warmth.",           
    tags: ["extreme-cold"],                          
    priority: "must-have"    
    },
  { id: "insulating-mid-layer",      
    label: "Insulating mid-layer",                
    description: "Breathable fleece or pullover to trap heat between layers.",                  
    tags: ["extreme-cold"],                          
    priority: "must-have"    
    },
  { id: "protective-outer-layer",    
    label: "Protective outer layer",              
    description: "Windproof/water-resistant jacket to block cold air.",                         
    tags: ["extreme-cold"],                          
    priority: "must-have"    
    },
  { id: "thermal-legwear",           
    label: "Thermal lined legwear",               
    description: "Wind-resistant, heat-insulated tights or leggings.",                         
    tags: ["extreme-cold", "ice-snow"],              
    priority: "must-have"    
    },
  { id: "wool-socks",                
    label: "Wool socks",                          
    description: "Thick, moisture-repelling socks for foot insulation.",                        
    tags: ["extreme-cold", "ice-snow"],              
    priority: "must-have"    
    },
  { id: "thermal-headwear",          
    label: "Thermal headwear",                    
    description: "Wool beanie to protect head and ears from cold.",                             
    tags: ["extreme-cold"],                          
    priority: "must-have"    
    },
  { id: "survival-bag",              
    label: "Survival bag",                        
    description: "First aid kit, blankets and emergency shelter for adverse conditions.",        
    tags: ["extreme-cold", "ice-snow"],              
    priority: "must-have"    
    },
  { id: "headtorch",                 
    label: "Headtorch",                           
    description: "Wide arc, max lumen; carry spare batteries for emergencies.",                 
    tags: ["extreme-cold", "ice-snow"],              
    priority: "nice-to-have" 
    },

  //Mud 
  { id: "mud-specific-shoes",        
    label: "Mud-specific trail shoes",            
    description: "Deep, wide lugs to dig into soft ground and shed mud effectively.",           
    tags: ["mud"],                                  

    priority: "must-have"    
    },
  { id: "running-tights",            
    label: "Running tights / leggings",           
    description: "Additional protection against cold, wind and mud splash.",                    
    tags: ["mud"],                                   
    priority: "nice-to-have" 
    },
  { id: "change-of-clothes",         
    label: "Change of clothes",                   
    description: "Spare set for post-run — first set will be heavily soiled.",                  
    tags: ["mud"],                                   
    priority: "nice-to-have" 
    },

  //Ice / Snow 
  { id: "microspikes",               
    label: "Microspikes / traction devices",      
    description: "Essential for icy terrain; studs for grip on packed snow and steep slopes.", 
    tags: ["ice-snow"],                              
    priority: "must-have"    
    },
  { id: "trekking-poles",            
    label: "Trekking poles",                      
    description: "Stability on slippery slopes and icy descents.",                              
    tags: ["ice-snow"],                              
    priority: "nice-to-have" 
    },

  //Universal 
  { id: "running-vest",              
    label: "Running vest",                        
    description: "Carries water, extra layers, nutrition and safety gear on longer routes.",    
    tags: ["heavy-rain", "extreme-cold", "mud", "ice-snow"], 
    priority: "must-have" 
    },
];