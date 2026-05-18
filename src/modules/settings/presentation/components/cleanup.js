const fs = require('fs');
const path = 'c:/Users/ChauRuon/Downloads/dessertflow-erp/src/modules/settings/presentation/components/SettingsPageClient.tsx';
let content = fs.readFileSync(path, 'utf8');

const importReplacement = `import { AppearanceSection } from './section/AppearanceSection';
import { BusinessSection } from './section/BusinessSection';
import { OperationsSection } from './section/OperationsSection';
import { SecuritySection } from './section/SecuritySection';
import { PermissionsSection } from './section/PermissionsSection';
import { PaymentSection } from './section/PaymentSection';
import { NotificationsSection } from './section/NotificationsSection';
import { sectionMeta } from '@/modules/settings/mocks/section-meta.mock';
import type { TSectionValues as SectionKey } from '@/modules/settings/domain/enum/section-key.enum';
import type { TPermissionValues as PermissionKey } from '@/modules/settings/domain/enum/permission-key.enum';
import type { ISettingsData as SettingsData } from '@/modules/settings/types/settings-data.type';
import type { IRolePermission as RolePermission } from '@/modules/settings/types/role-permission.type';
`;

content = content.replace(/import \{ SwitchCard \}[\s\S]*?import \{ TPermissionKey \} from '@\/modules\/settings\/domain\/enum\/permission-key\.enum';\r?\n/, importReplacement);

content = content.replace(/const permissionMeta: Array<\{ key: PermissionKey; label: string \}> = \[[\s\S]*?\];\r?\n/, '');

content = content.replace(/const branchOptions = \[[\s\S]*?\];\r?\n/, '');
content = content.replace(/const recentDevices = \[[\s\S]*?\];\r?\n/, '');

content = content.replace(/function BusinessSection[\s\S]*?(?=export default function SettingsPage\(\))/m, '');

fs.writeFileSync(path, content, 'utf8');
