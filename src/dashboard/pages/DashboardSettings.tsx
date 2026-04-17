import { Settings, Bell, Shield, Users, Key, Zap } from 'lucide-react';

const SECTIONS = [
  {
    icon: Bell,
    title: 'Alert Thresholds',
    items: [
      { label: 'Streaming Velocity Alert (Tier-1)', value: '+500% in 6h', type: 'threshold' },
      { label: 'CTR Floor Threshold', value: '1.2%', type: 'threshold' },
      { label: 'Budget Burn Alert', value: '90% utilized', type: 'threshold' },
      { label: 'Risk Escalation (Days Blocked)', value: '7 days', type: 'threshold' },
    ]
  },
  {
    icon: Zap,
    title: 'AI Insight Settings',
    items: [
      { label: 'AI Insight Rotation Interval', value: '12 seconds', type: 'config' },
      { label: 'Rocksteady Scan Frequency', value: 'Every 4 hours', type: 'config' },
      { label: 'Auto-Flag Emerging Artists (Score)', value: '≥ 60', type: 'config' },
    ]
  },
  {
    icon: Shield,
    title: 'Access & Security',
    items: [
      { label: 'Session Timeout', value: '8 hours', type: 'config' },
      { label: 'Two-Factor Authentication', value: 'Enabled', type: 'status' },
      { label: 'API Access', value: 'Restricted', type: 'status' },
    ]
  },
  {
    icon: Users,
    title: 'Team Access',
    items: [
      { label: 'Randy Jackson', value: 'Executive — Full Access', type: 'user' },
      { label: 'Paula Moore', value: 'Executive — Full Access', type: 'user' },
      { label: 'Latie', value: 'A&R Director — Read + Edit', type: 'user' },
      { label: 'Operations Team', value: '4 members — Read + Edit', type: 'user' },
    ]
  },
];

export default function DashboardSettings() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-4 h-4 text-white/40" />
          <h1 className="text-[20px] font-bold text-white tracking-tight font-['Satoshi',sans-serif]">Settings</h1>
        </div>
        <p className="text-[12px] text-white/30">Platform configuration and access control</p>
      </div>

      <div className="space-y-4">
        {SECTIONS.map(section => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="bg-[#0D0E11] border border-white/[0.06] rounded-lg overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/[0.06]">
                <Icon className="w-3.5 h-3.5 text-white/30" />
                <span className="text-[12px] font-semibold text-white/60 tracking-wide">{section.title}</span>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {section.items.map(item => (
                  <div key={item.label} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors">
                    <span className="text-[13px] text-white/60">{item.label}</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-[12px] font-mono ${
                        item.type === 'threshold' ? 'text-[#06B6D4]' :
                        item.type === 'status' ? 'text-[#10B981]' :
                        item.type === 'user' ? 'text-white/40' :
                        'text-white/50'
                      }`}>{item.value}</span>
                      {item.type !== 'user' && (
                        <button className="text-[10px] font-mono text-white/20 hover:text-white/50 transition-colors border border-white/[0.06] hover:border-white/[0.15] rounded px-2 py-0.5">
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 p-4 bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-lg">
        <Key className="w-4 h-4 text-[#EF4444] shrink-0" />
        <div className="flex-1">
          <p className="text-[12px] font-medium text-[#EF4444]">Danger Zone</p>
          <p className="text-[11px] text-white/40 mt-0.5">Resetting platform data or revoking access is irreversible.</p>
        </div>
        <button className="px-3 py-1.5 rounded border border-[#EF4444]/20 text-[11px] text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors font-mono">
          Manage
        </button>
      </div>
    </div>
  );
}
