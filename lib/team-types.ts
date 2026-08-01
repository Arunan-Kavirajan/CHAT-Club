export type AdminTeam = {
  id: string;
  name: string;
};

export type AdminTeamCategory = {
  id: string;
  name: string;
  teams: AdminTeam[];
};

export type AdminMember = {
  id: string;
  name: string;
  categoryId: string;
  teamId: string | null;
  deptClass: string;
  position: string;
  linkedin: string;
  photoUrl: string | null;
};