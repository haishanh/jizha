import { arch, cpus, release, platform, type, totalmem } from 'os';

export async function GET() {
  const info = {
    arch: arch(),
    cpus: cpus(),
    release: release(),
    platform: platform(),
    type: type(),
    totalmem: totalmem(),
  };
  return Response.json(info);
}
