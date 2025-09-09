import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isAndhraPradesh, isInternational, getGstType } from "@/utils/addressUtils";

export interface GstSetting {
  id: string;
  setting_name: string;
  percentage: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export const useGstSettings = () => {
  const [gstSettings, setGstSettings] = useState<GstSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchGstSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gst_settings')
        .select('*')
        .order('setting_name');

      if (error) throw error;
      setGstSettings(data || []);
    } catch (error) {
      console.error('Error fetching GST settings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch GST settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateGstSetting = async (settingName: string, percentage: number) => {
    try {
      const { error } = await supabase
        .from('gst_settings')
        .update({ percentage })
        .eq('setting_name', settingName);

      if (error) throw error;

      await fetchGstSettings();
      toast({
        title: "Success",
        description: "GST setting updated successfully",
      });
    } catch (error) {
      console.error('Error updating GST setting:', error);
      toast({
        title: "Error", 
        description: "Failed to update GST setting",
        variant: "destructive",
      });
    }
  };

  const calculateGst = (amount: number, state: string, country: string = 'India') => {
    let gstRate = 0;

    if (isInternational(country)) {
      // International order
      const internationalSetting = gstSettings.find(s => s.setting_name === 'international_gst');
      gstRate = internationalSetting?.percentage || 0;
    } else if (isAndhraPradesh(state)) {
      // Andhra Pradesh (local state)
      const apSetting = gstSettings.find(s => s.setting_name === 'andhra_pradesh_gst');
      gstRate = apSetting?.percentage || 0;
    } else {
      // Other Indian states
      const igstSetting = gstSettings.find(s => s.setting_name === 'igst_other_states');
      gstRate = igstSetting?.percentage || 0;
    }

    const gstAmount = (amount * gstRate) / 100;
    const gstType = getGstType(state, country);
    
    return {
      gstRate,
      gstAmount,
      gstType,
      totalWithGst: amount + gstAmount
    };
  };

  useEffect(() => {
    fetchGstSettings();
  }, []);

  return {
    gstSettings,
    loading,
    updateGstSetting,
    calculateGst,
    refetch: fetchGstSettings
  };
};
