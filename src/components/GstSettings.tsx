import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGstSettings } from "@/hooks/useGstSettings";
import { Percent, Save, RefreshCw } from "lucide-react";

const GstSettings = () => {
  const { gstSettings, loading, updateGstSetting } = useGstSettings();
  const [localValues, setLocalValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  const handleInputChange = (settingName: string, value: string) => {
    setLocalValues(prev => ({
      ...prev,
      [settingName]: value
    }));
  };

  const handleSave = async (settingName: string) => {
    const value = localValues[settingName];
    if (!value) return;

    const percentage = parseFloat(value);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      return;
    }

    setSaving(prev => ({ ...prev, [settingName]: true }));
    try {
      await updateGstSetting(settingName, percentage);
      setLocalValues(prev => ({
        ...prev,
        [settingName]: ''
      }));
    } finally {
      setSaving(prev => ({ ...prev, [settingName]: false }));
    }
  };

  const getDisplayName = (settingName: string) => {
    switch (settingName) {
      case 'andhra_pradesh_gst':
        return 'Andhra Pradesh GST';
      case 'igst_other_states':
        return 'IGST (Other Indian States)';
      case 'international_gst':
        return 'International GST';
      default:
        return settingName.replace(/_/g, ' ').toUpperCase();
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Tax Settings
          </CardTitle>
          <CardDescription>
            Configure GST rates for different regions
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Percent className="h-5 w-5" />
          Tax Settings
        </CardTitle>
        <CardDescription>
          Configure GST rates for different regions. Changes will apply to new orders immediately.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {gstSettings.map((setting) => (
          <div key={setting.id} className="space-y-2">
            <Label htmlFor={setting.setting_name}>
              {getDisplayName(setting.setting_name)}
            </Label>
            <p className="text-sm text-muted-foreground mb-2">
              {setting.description}
            </p>
            <div className="flex gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Input
                    id={setting.setting_name}
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder={`Current: ${setting.percentage}%`}
                    value={localValues[setting.setting_name] || ''}
                    onChange={(e) => handleInputChange(setting.setting_name, e.target.value)}
                    className="pr-8"
                  />
                  <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <Button
                onClick={() => handleSave(setting.setting_name)}
                disabled={!localValues[setting.setting_name] || saving[setting.setting_name]}
                size="sm"
                className="min-w-[80px]"
              >
                {saving[setting.setting_name] ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Current rate: {setting.percentage}%
            </div>
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold mb-2">How GST is Applied:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• <strong>Andhra Pradesh:</strong> Local GST rate applied</li>
            <li>• <strong>Other Indian States:</strong> IGST rate applied</li>
            <li>• <strong>International Orders:</strong> International GST rate applied</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default GstSettings;